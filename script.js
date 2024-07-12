function parseISODuration(isoDuration) {
    const regex = /PT((\d+)H)?((\d+)M)?((\d+)S)?/;
    const matches = isoDuration.match(regex);

    const hours = parseInt(matches[2]) || 0;
    const minutes = parseInt(matches[4]) || 0;
    const seconds = parseInt(matches[6]) || 0;

    return (hours * 3600) + (minutes * 60) + seconds;
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);  

    let result = '';
    if (hours > 0) {
        result += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }
    if (minutes > 0) {
        result += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
    }
    result += `${seconds} second${seconds > 1 ? 's' : ''}`;

    return result;
}

async function analyzePlaylist() {
    const playlistUrl = document.querySelector('input[name="search_string"]').value;
    const playlistId = getPlaylistId(playlistUrl);

    if (playlistId === 'invalid_playlist_link') {
        displayError('Invalid playlist link');
        return;
    }

    let nextPage = '';
    let videoCount = 0;
    let totalDuration = 0;
    const displayText = [];

    try {
        while (true) {
            const videoIds = [];

            console.log('Fetching video IDs...');
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&fields=items/contentDetails/videoId,nextPageToken&key=${API_KEY}&playlistId=${playlistId}&pageToken=${nextPage}`);
            const results = await response.json();
            console.log('Fetched video IDs:', results);

            if (results.error) {
                displayError(results.error.message);
                break;
            }

            results.items.forEach(item => videoIds.push(item.contentDetails.videoId));

            const ids = videoIds.join(',');
            videoCount += videoIds.length;

            console.log('Fetching video durations...');
            const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?&part=contentDetails&id=${ids}&key=${API_KEY}&fields=items/contentDetails/duration`);
            const videoResults = await videoResponse.json();
            console.log('Fetched video durations:', videoResults);

            videoResults.items.forEach(item => {
                const duration = parseISODuration(item.contentDetails.duration);
                totalDuration += duration;
            });

            if (!results.nextPageToken || videoCount >= 500) {
                if (videoCount >= 500) {
                    displayText.push('No of videos limited to 500.');
                }
                displayText.push(`No of videos: ${videoCount}`);
                displayText.push(`Average length of video: ${formatDuration(totalDuration / videoCount)}`);
                displayText.push(`Total length of playlist: ${formatDuration(totalDuration)}`);
                displayText.push(`At 1.25x: ${formatDuration(totalDuration / 1.25)}`);
                displayText.push(`At 1.50x: ${formatDuration(totalDuration / 1.5)}`);
                displayText.push(`At 1.75x: ${formatDuration(totalDuration / 1.75)}`);
                displayText.push(`At 2.00x: ${formatDuration(totalDuration / 2)}`);
                break;
            }

            nextPage = results.nextPageToken;
        }
    } catch (error) {
        displayError(`Error fetching video IDs: ${error}`);
    }

    displayResults(displayText);
}

function getPlaylistId(playlistLink) {
    const regex = /^([\S]+list=)?([\w_-]+)[\S]*$/;
    const match = playlistLink.match(regex);
    return match ? match[2] : 'invalid_playlist_link';
}

function displayError(message) {
    const resultContainer = document.querySelector('.result');
    resultContainer.innerHTML = `<p class="error">${message}</p>`;
}

function displayResults(results) {
    const resultContainer = document.querySelector('.result');
    resultContainer.innerHTML = results.map(result => `<p>${result}</p>`).join('');
}

const API_KEY = "add-your-api-key-for-youtube-playlist"; 
