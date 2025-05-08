// 博客相关的JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画库
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });
    
    // 加载博客文章
    loadBlogPosts();
    
    // 分类过滤功能
    setupCategoryFilters();
    
    // 初始化滚动进度
    initScrollProgress();
});

// 加载博客文章
async function loadBlogPosts() {
    try {
        const postContainer = document.getElementById('blogPostsContainer');
        
        // 获取所有Markdown文件
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
                },
                // 可以添加更多示例博客
            ];
        }
        
        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 清空容器
        postContainer.innerHTML = '';
        
        // 渲染博客文章卡片
        if (blogPosts.length > 0) {
            blogPosts.forEach(post => {
                postContainer.appendChild(createBlogCard(post));
            });
        } else {
            postContainer.innerHTML = '<div class="no-posts"><p>暂无博客文章</p></div>';
        }
    } catch (error) {
        console.error('加载博客文章失败:', error);
        document.getElementById('blogPostsContainer').innerHTML = 
            '<div class="error-message"><p>加载文章失败，请稍后再试</p></div>';
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

// 设置分类过滤器
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取当前分类
            const category = this.getAttribute('data-category');
            
            // 过滤博客文章
            filterBlogPosts(category);
        });
    });
}

// 过滤博客文章
function filterBlogPosts(category) {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        if (category === 'all') {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            const tags = card.getAttribute('data-tags').split(',');
            
            if (tags.includes(category)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        }
    });
}

// 初始化滚动进度
function initScrollProgress() {
    const scrollProgressContainer = document.getElementById('scrollProgressContainer');
    const progressCircle = document.querySelector('.scroll-progress-circle-fill');
    const progressPercentage = document.querySelector('.scroll-progress-percentage');
    
    // 圆形进度条的周长
    const circumference = 2 * Math.PI * 45;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    
    function updateProgress() {
        // 计算滚动百分比
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
        
        // 更新圆形进度条
        const offset = circumference - (scrollPercentage * circumference);
        progressCircle.style.strokeDashoffset = offset;
        
        // 更新百分比文本
        progressPercentage.textContent = `${Math.round(scrollPercentage * 100)}%`;
        
        // 显示/隐藏滚动进度条
        if (scrollTop > 300) {
            scrollProgressContainer.classList.add('visible');
        } else {
            scrollProgressContainer.classList.remove('visible');
        }
    }
    
    // 添加滚动事件监听器
    window.addEventListener('scroll', updateProgress);
    
    // 点击返回顶部
    scrollProgressContainer.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 鼠标悬停效果
    scrollProgressContainer.addEventListener('mouseenter', function() {
        this.classList.add('hover');
    });
    
    scrollProgressContainer.addEventListener('mouseleave', function() {
        this.classList.remove('hover');
    });
} 