document.addEventListener('DOMContentLoaded', function() {
    // 从data.json加载数据
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // 填充表单数据
            document.getElementById('adminSiteName').value = data.siteName;
            document.getElementById('adminSiteSubtitle').value = data.siteSubtitle;
            document.getElementById('logoPreview').src = data.logo;

            // 渲染资源项
            renderItems(data.resources, 'adminResources');

            // 设置Logo预览
            document.getElementById('adminLogo').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.getElementById('logoPreview').src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });

            // 添加资源按钮事件
            document.getElementById('addResource').addEventListener('click', function() {
                const newItem = {
                    id: Date.now(),
                    title: '新资源',
                    icon: '/default-icon.png',
                    link: ''
                };
                renderItem(newItem, 'adminResources');
            });

            // 保存配置按钮事件
            document.getElementById('saveConfig').addEventListener('click', saveConfig);
        })
        .catch(error => {
            console.error('加载数据失败:', error);
        });
});

// 渲染资源项
function renderItems(items, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    items.forEach(item => {
        renderItem(item, containerId);
    });
}

// 渲染单个资源项
function renderItem(item, containerId) {
    const container = document.getElementById(containerId);
    const itemCard = document.createElement('div');
    itemCard.className = 'item-card';
    itemCard.dataset.id = item.id;

    itemCard.innerHTML = `
        <input type="text" class="item-title" value="${item.title}" placeholder="标题">
        <input type="text" class="item-link" value="${item.link}" placeholder="链接">
        <input type="file" class="item-icon">
        <img src="${item.icon}" class="item-icon-preview" style="max-width: 50px; max-height: 50px; margin: 5px 0;">
        <button class="btn-remove" style="margin-top: 5px;">删除</button>
    `;

    container.appendChild(itemCard);

    // 设置图标预览
    itemCard.querySelector('.item-icon').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                itemCard.querySelector('.item-icon-preview').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 删除按钮事件
    itemCard.querySelector('.btn-remove').addEventListener('click', function() {
        container.removeChild(itemCard);
    });
}

// 保存配置
function saveConfig() {
    // 收集表单数据
    const siteName = document.getElementById('adminSiteName').value;
    const siteSubtitle = document.getElementById('adminSiteSubtitle').value;
    const logo = document.getElementById('logoPreview').src;

    // 收集资源项
    const resources = [];
    document.querySelectorAll('#adminResources .item-card').forEach(card => {
        resources.push({
            id: card.dataset.id,
            title: card.querySelector('.item-title').value,
            link: card.querySelector('.item-link').value,
            icon: card.querySelector('.item-icon-preview').src
        });
    });

    // 创建完整配置
    const config = {
        siteName,
        siteSubtitle,
        logo,
        resources,
        shareItems: [], // 可以扩展其他部分
        homeItems: [],  // 可以扩展其他部分
        copyright: '© 2025 星辰导航 - 永久导航'
    };

    // 将数据写入data.json
    fetch('data.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config, null, 2)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
    .then(data => {
        alert('保存成功!');
    })
    .catch(error => {
        console.error('保存配置失败:', error);
        alert('保存失败，请重试!');
    });
}
