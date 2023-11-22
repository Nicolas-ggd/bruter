function fetchUrls() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/consumer", true);
    xhr.onload = function () {
        if (this.status === 200) {
            // Parse JSON response
            const data = JSON.parse(this.responseText);

            // Get container element
            const container = document.getElementById("container");
            var bar = document.querySelector(".progress-bar");
            var speedElement = document.getElementById("data");
            // Clear loading message and append data
            container.innerHTML = "";
            data.Urls.forEach(url => {
				// Update the speedElement for each URL
				bar.style.width = url.progress + "%";
				speedElement.innerText = url.data;
				bar.innerText = url.progress.toFixed(0) + "%";
                if (url.status === 200 || url.status === 301 || url.status === 302) {
                    let urlDisplay;
                    if (url.status === 301) {
                        // For 301 status code, use redirectpath
                        urlDisplay = `<p>${url.id} <a href="${url.path}" target="_blank">${url.path}</a> - <span style="color: orange;">REDIRECTS TO:</span> <a href="${url.redirectpath}" target="_blank">${url.redirectpath}</a> - <span style="color: green;"> http code: ${url.status} progress: ${url.progress} ${url.data}</span></p>`;
                    } else if (url.status === 302) {
                        // For 302 status code, concatenate path and redirectpath
                        let targetPath = url.redirectpath ? url.path + url.redirectpath : url.path;
                        urlDisplay = `<p>${url.id} <a href="${url.path}" target="_blank">${url.path}</a> - <span style="color: orange;">REDIRECTS TO:</span> <a href="${targetPath}" target="_blank">${targetPath}</a> - <span style="color: green;"> http code: ${url.status} progress: ${url.progress} ${url.data}</span></p>`;
                    } else {
                        // For other status codes (200), use the original path
                        urlDisplay = `<p>${url.id} <a href="${url.path}" target="_blank">${url.path}</a> - <span style="color: green;"> http code: ${url.status} progress: ${url.progress.toFixed(0)}% ${url.data}</span></p>`;
                    }

                    container.innerHTML += urlDisplay;
                }
            });
            // Update the overall progress bar and data element
        } else {
            console.error("Error fetching data");
        }
    };
    xhr.send();
}

// Call fetchUrls() when the page is loaded
window.onload = fetchUrls;
setInterval(fetchUrls, 1000);
