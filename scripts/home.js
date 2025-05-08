// 主页相关的JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 加载博客预览
    loadBlogPreview();
});

// 加载博客预览
async function loadBlogPreview() {
    try {
        const previewContainer = document.getElementById('blogPreviewContainer');
        if (!previewContainer) return;
        
        // 获取博客文章数据
        const response = await fetch('/blogs/index.json');
        let blogPosts = [];
        
        if (response.ok) {
            blogPosts = await response.json();
        } else {
            // 如果没有index.json，模拟一些数据用于演示
            blogPosts = [
                {
                    slug: 'hello-world',
                    title: '我的第一篇博客',
                    date: '2024-06-19',
                    description: '这是我的第一篇博客文章，介绍了我的个人网站',
                    thumbnail: 'https://placekitten.com/500/300',
                    tags: ['个人', '网站', '开发']
                }
                // 可以添加更多示例博客
            ];
        }
        
        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 只显示最多3篇最新文章
        const latestPosts = blogPosts.slice(0, 3);
        
        // 清空容器
        previewContainer.innerHTML = '';
        
        // 渲染博客文章卡片
        if (latestPosts.length > 0) {
            latestPosts.forEach(post => {
                previewContainer.appendChild(createBlogCard(post));
            });
        } else {
            previewContainer.innerHTML = '<div class="no-posts"><p>暂无博客文章</p></div>';
        }
    } catch (error) {
        console.error('加载博客预览失败:', error);
        const previewContainer = document.getElementById('blogPreviewContainer');
        if (previewContainer) {
            previewContainer.innerHTML = 
                '<div class="error-message"><p>加载预览失败，请稍后再试</p></div>';
        }
    }
}

// 创建博客卡片
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.setAttribute('data-tags', post.tags.join(','));
    
    // 格式化日期
    const dateObj = new Date(post.date);
    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    
    // 创建博客卡片HTML
    card.innerHTML = `
        <div class="shine-effect"></div>
        <img src="${post.thumbnail || 'assets/blog-default.jpg'}" alt="${post.title}" class="blog-card-image">
        <div class="blog-card-content">
            <h3 class="blog-card-title"><a href="blog-post.html?slug=${post.slug}">${post.title}</a></h3>
            <div class="blog-card-meta">
                <span class="blog-card-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                <div class="blog-card-tags">
                    ${post.tags.slice(0, 2).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <p class="blog-card-excerpt">${post.description}</p>
            <a href="blog-post.html?slug=${post.slug}" class="blog-card-link">
                <span data-i18n="readMore">阅读全文</span> <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
    
    return card;
} 