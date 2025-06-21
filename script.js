document.addEventListener('DOMContentLoaded', function() {
    // 从data.json加载数据
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 更新网站基本信息
            document.getElementById('siteName').textContent = data.siteName;
            document.getElementById('siteSubtitle').textContent = data.siteSubtitle;
            document.getElementById('logoImg').src = data.logo;
            document.getElementById('copyright').textContent = data.copyright;

            // 渲染资源卡片
            renderCards(data.resources, 'resources');
            renderCards(data.shareItems, 'share');
            renderCards(data.homeItems, 'home');

            // 设置标签页切换功能
            setupTabs();
        })
        .catch(error => {
            console.error('加载数据失败:', error);
        });

    // 搜索按钮功能
    document.getElementById('searchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            const cardTitle = card.querySelector('.card-title').textContent.toLowerCase();
            if (cardTitle.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 渲染卡片函数
function renderCards(items, tabId) {
    const container = document.getElementById(tabId);
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('a');
        card.href = item.link;
        card.target = '_blank';
        card.className = 'card';
        
        card.innerHTML = `
            <div class="icon-container">
                <img src="${item.icon}" alt="${item.title}">
            </div>
            <div class="card-title">${item.title}</div>
        `;
        
        container.appendChild(card);
    });
}

// 设置标签页切换功能
function setupTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            document.querySelectorAll('.tab').forEach(item => {
                item.classList.remove('active');
            });
            
            // 为当前点击的标签添加active类
            this.classList.add('active');
            
            // 隐藏所有内容区域
            document.querySelectorAll('.content-area').forEach(area => {
                area.classList.remove('active');
            });
            
            // 显示对应的内容区域
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}
