document.getElementById('trend-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const keywords = document.getElementById('keywords').value;

    axios.get('/api/trends', {
        params: {
            start_date: startDate,
            end_date: endDate,
            keywords: keywords
        }
    }).then(response => {
        const trendsData = response.data;
        const ctx = document.getElementById('trends-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendsData.date,
                datasets: Object.keys(trendsData).filter(key => key !== 'date').map((keyword, i) => ({
                    label: keyword,
                    data: trendsData[keyword],
                    backgroundColor: `rgba(${i * 50}, ${i * 50}, ${i * 50}, 0.2)`,
                    borderColor: `rgba(${i * 50}, ${i * 50}, ${i * 50}, 1)`,
                    borderWidth: 1
                }))
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });

    axios.get('/api/news', {
        params: { keywords }
    }).then(response => {
        const articles = response.data.articles;
        const newsContainer = document.getElementById('news-articles');
        newsContainer.innerHTML = '';

        articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.className = 'article';
            articleElement.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(articleElement);
        });
    });
});
