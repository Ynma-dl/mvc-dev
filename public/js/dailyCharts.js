document.addEventListener('DOMContentLoaded', function () {

    // Configuration commune du thème
    Chart.defaults.color = '#94A3B8';       // --secondary-muted
    Chart.defaults.font.family = "sans-serif";


    function updateChartTime(updatedAt, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return; // évite un crash si l'id n'existe pas encore dans le DOM

        const now = new Date();
        const updateDate = new Date(updatedAt);
        const diff = Math.floor((now - updateDate) / 1000);

        let text;

        if (diff < 60) {
            text = "mis à jour il y a quelques secondes";
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            text = `mis à jour il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
        } else if (diff < 86400) {
            const heures = Math.floor(diff / 3600);
            text = `mis à jour il y a ${heures} heure${heures > 1 ? "s" : ""}`;
        } else {
            const jours = Math.floor(diff / 86400);
            text = `mis à jour il y a ${jours} jour${jours > 1 ? "s" : ""}`;
        }

        element.innerHTML = `<i class="fa-regular fa-clock"></i> ${text}`;
    }

    const hours = generateHoursWithBuffer();

    const visitorsPerHour = [
        12, 82, 5, 3,
        4, 7, 18, 35,
        58, 82, 110, 145,
        172, 168, 156, 141,
        126, 112, 95, 81,
        63, 48, 31, 18
    ];

    if (document.querySelector("#visitors")) {
        const allVisitors = visitorsPerHour.reduce((total, actuel) => total + actuel, 0);
        document.getElementById("visitors").textContent = allVisitors;
    }


    // APRÈS : de 0h à (heure actuelle + 2h), avec une marge de respiration
    function generateHoursWithBuffer(bufferHours = 2) {
        const currentHour = new Date().getHours();
        let end = currentHour + bufferHours;
        if (end > 23) end = 23;

        const hours = [];
        for (let i = 0; i <= end; i++) {
            hours.push(`${i.toString().padStart(2, "0")}h`);
        }
        return hours;
    }

    function buildChartData(rawData, labelsLength, currentHour) {
        const result = [];
        for (let i = 0; i < labelsLength; i++) {
            result.push(i > currentHour ? null : (rawData?.[i] ?? 0));
        }
        return result;
    }

    async function loadDashboardStats() {
        console.log("Chargement dashboard...");

        let data;

        try {
            const response = await fetch("/admin-complique/stats");
            data = await response.json();
        } catch (err) {
            console.error("Erreur lors du chargement des stats :", err);
            return;
        }

        // Mise à jour du texte "mis à jour il y a..."
        updateChartTime(data.updatedAt, "salesUpdated");
        updateChartTime(data.updatedAt, "ordersUpdated");

        // Mise à jour du graphique ventes (données complètes sur 24h)
        salesChart.data.datasets[0].data = data.hoursSales;
        salesChart.update();

        // Mise à jour du graphique commandes (bug corrigé : data.orders, pas data.sales)
        ordersChart.data.datasets[0].data = data.orders;
        ordersChart.update();

        if (document.querySelector("#CA")) {
            const allOrders = data.orders.reduce((total, actuel) => total + actuel, 0);
            document.getElementById("odersCount").textContent = allOrders;
        }

        if (document.querySelector("#CA")) {
            document.getElementById("CA").textContent = data.dailySales + " FCFA";
        }

    }

    // Fonction utilitaire pour créer un dégradé sous la courbe
    function createGradient(ctx, colorStart) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 160);
        gradient.addColorStop(0, colorStart + '55'); // opacité ~33%
        gradient.addColorStop(1, colorStart + '00'); // transparent
        return gradient;
    }

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },

            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: '#F8FAFC',
                bodyColor: '#F8FAFC',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 10,
                displayColors: false
            },

            zoom: {
                limits: {
                    x: {
                        minRange: 6
                    }
                },

                pan: {
                    enabled: true,
                    mode: "x"
                },

                zoom: {
                    wheel: {
                        enabled: true
                    },
                    pinch: {
                        enabled: true
                    },
                    drag: {
                        enabled: true,
                        backgroundColor: "rgba(90,255,112,0.15)",
                        borderWidth: 1
                    },
                    mode: "x"
                }
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    maxTicksLimit: 12,
                    font: {
                        size: 10
                    }
                }
            },

            y: {
                beginAtZero: true,
                ticks: {
                    display: false
                },
                grid: {
                    display: false
                }
            }
        },

        elements: {
            line: {
                tension: 0.35,
                borderWidth: 3
            },
            point: {
                radius: 2,
                hoverRadius: 6
            }
        }
    };

    // --- VENTES DU JOUR ---
    const ctxSales = document.getElementById('chartSales').getContext('2d');
    const salesChart = new Chart(ctxSales, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                data: [],
                borderColor: '#5aff70',
                backgroundColor: createGradient(ctxSales, '#5aff70'),
                fill: true,
                pointBackgroundColor: '#5aff70',
                pointBorderColor: '#0B0F19'
            }]
        },
        options: commonOptions
    });

    // --- COMMANDES ---
    const ctxOrders = document.getElementById('chartOrders').getContext('2d');
    const ordersChart = new Chart(ctxOrders, {
        type: "bar",
        data: {
            labels: hours,
            datasets: [{
                label: "Commandes",
                data: [],
                backgroundColor: "#F59E0B",
                borderRadius: 4,
                barThickness: 12
            }]
        },
        options: commonOptions
    });

    // --- VISITEURS ---
    const ctxVisitors = document.getElementById('chartVisitors').getContext('2d');
    const visitorsChart = new Chart(ctxVisitors, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                data: visitorsPerHour,
                borderColor: '#0EA5E9',
                backgroundColor: createGradient(ctxVisitors, '#0EA5E9'),
                fill: true,
                pointBackgroundColor: '#0EA5E9',
                pointBorderColor: '#0B0F19'
            }]
        },
        options: commonOptions
    });

    console.log("Avant appel stats");
    loadDashboardStats();
    console.log("Après appel stats");

    setInterval(loadDashboardStats, 30000);

});