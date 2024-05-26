// Alpha Vantage API'den veri çeken class
class AlphaVantageFetcher {
    constructor(apiKey) {
        this.apiKey = apiKey; // API anahtarını saklar
        this.baseUrl = 'https://www.alphavantage.co/query?'; // API temel URL'si
    }

    // API'den veri çeken asenkron fonksiyon
    async fetchData(symbol) {
        const url = `${this.baseUrl}function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${this.apiKey}`;
        const response = await fetch(url); // API'ye istek gönder
        const data = await response.json(); // Yanıtı JSON olarak al
        return data; // Veriyi döndür
    }

    // Veriyi tablo olarak ekranda gösteren fonksiyon
    displayData(data, limit = 10) {
        const timeSeries = data['Time Series (60min)']; // Zaman serisi verisini al
        const veriDiv = document.getElementById('veri'); // Veri göstermek için HTML elementi

        if (!timeSeries) {
            veriDiv.innerHTML = 'Veri alınamadı'; // Veri yoksa mesaj göster
            return;
        }

        // Tablo başlığı oluştur
        let table = `<table>
                        <tr>
                            <th>Zaman</th>
                            <th>Açılış</th>
                            <th>Yüksek</th>
                            <th>Düşük</th>
                            <th>Kapanış</th>
                            <th>Hacim</th>
                        </tr>`;

        let labels = []; // Grafik için zaman etiketleri
        let dataPoints = []; // Grafik için veri noktaları
        let count = 0;

        // Zaman serisi verilerini tabloya ekle
        for (let time in timeSeries) {
            if (count >= limit) break; // Limit kadar veri göster
            table += `<tr>
                        <td>${time}</td>
                        <td>${timeSeries[time]['1. open']}</td>
                        <td>${timeSeries[time]['2. high']}</td>
                        <td>${timeSeries[time]['3. low']}</td>
                        <td>${timeSeries[time]['4. close']}</td>
                        <td>${timeSeries[time]['5. volume']}</td>
                    </tr>`;
            labels.push(time); // Zaman etiketini ekle
            dataPoints.push(parseFloat(timeSeries[time]['4. close'])); // Kapanış fiyatını ekle
            count++;
        }

        table += `</table>`; // Tabloyu kapat
        veriDiv.innerHTML = table; // HTML elementine tabloyu yerleştir

        this.createChart(labels, dataPoints); // Grafik oluştur
    }

    // Grafik oluşturan fonksiyon
    createChart(labels, dataPoints) {
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line', // Grafik tipi
            data: {
                labels: labels, // Zaman etiketleri
                datasets: [{
                    label: 'Kapanış Fiyatı', // Grafik etiketi
                    data: dataPoints, // Veri noktaları
                    borderColor: 'rgba(75, 192, 192, 1)', // Çizgi rengi
                    borderWidth: 1, // Çizgi kalınlığı
                    fill: false // Dolgu yok
                }]
            },
            options: {
                responsive: true, // Duyarlı tasarım
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Zaman' // X ekseni başlığı
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fiyat' // Y ekseni başlığı
                        }
                    }
                }
            }
        });
    }
}

// Resimlerin altındaki açıklamaları göstermek için JavaScript kodları
function showDescription(descriptionId) {
    var descriptions = document.querySelectorAll('.descriptions');
    descriptions.forEach(function(description) {
        description.style.opacity = '0'; // Önce tüm açıklamaların görünürlüğünü sıfırla
    });

    var targetDescription = document.getElementById(descriptionId);
    if (targetDescription) {
        targetDescription.style.opacity = '1'; // Hedef açıklamayı görünür hale getir
    }
}

// Bölümleri açıp kapatmak için JavaScript kodları
function toggleSection(sectionId) {
    var section = document.getElementById(sectionId); // Hedef bölümü al
    var sections = document.querySelectorAll('section'); // Tüm bölümleri al

    sections.forEach(function(sec) {
        if (sec.id !== sectionId) {
            sec.style.display = 'none'; // Hedef dışındaki tüm bölümleri gizle
        }
    });

    var currentDisplay = section.style.display;

    if (currentDisplay === 'block' || currentDisplay === '') {
        section.style.display = 'none'; // Bölüm açıksa gizle
    } else {
        section.style.display = 'block'; // Bölüm kapalıysa aç
    }
}

// Veri bölümünü açıp kapatmak için işlev
function toggleVeri() {
    var veriContainer = document.getElementById('veri-container');
    if (veriContainer.style.display === 'none' || veriContainer.style.display === '') {
        veriContainer.style.display = 'flex'; // Flexbox düzenini kullan
    } else {
        veriContainer.style.display = 'none'; // Veri bölümü açıksa gizle
    }
}

// Örnek API çağrısı
const fetcher = new AlphaVantageFetcher('YOUR_API_KEY'); // API anahtarınızı ekleyin
fetcher.fetchData('AAPL').then(data => fetcher.displayData(data, 10)); // 10 satır ile sınırlı veri çek ve göster
