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
    
    // 初始化滚动进度
    initScrollProgress();

    // 初始化3D倾斜效果
    initTiltEffect();
});

// 加载博客文章
async function loadBlogPosts() {
    try {
        const postContainer = document.getElementById('blogPostsContainer');
        
        // 从本地获取索引文件
        const indexUrl = 'blogs/index.md';
        console.log('尝试获取索引文件:', indexUrl);
        
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            console.error('索引文件请求失败，状态码:', response.status);
            throw new Error('无法获取博客索引');
        }
        
        const indexContent = await response.text();
        console.log('索引文件内容:', indexContent);
        
        // 解析索引文件获取博客列表
        const blogSlugs = indexContent.split('\n')
            .filter(line => line.trim())
            .map(line => {
                // 从格式 "1. Git" 中提取出 "Git"
                const match = line.match(/\d+\.\s+(.*)/);
                return match ? match[1].trim() : null;
            })
            .filter(slug => slug);
            
        console.log('解析出的博客列表:', blogSlugs);
        
        // 清空容器
        postContainer.innerHTML = '';
        
        // 如果没有博客文章
        if (blogSlugs.length === 0) {
            postContainer.innerHTML = '<div class="no-posts"><p>暂无博客文章</p></div>';
            return;
        }
        
        // 存储所有博客文章的数据
        const blogPosts = [];
        
        // 获取每篇博客的详细信息
        for (const slug of blogSlugs) {
            try {
                // 获取文章内容
                const postUrl = `blogs/${slug}.md`;
                console.log('尝试获取文章:', postUrl);
                
                const postResponse = await fetch(postUrl);
                
                if (!postResponse.ok) {
                    console.error(`文章 ${slug} 请求失败，状态码:`, postResponse.status);
                    continue;
                }
                
                const postContent = await postResponse.text();
                console.log(`文章 ${slug} 内容前100个字符:`, postContent.substring(0, 100));
                
                const { metadata } = parseMarkdown(postContent);
                console.log(`文章 ${slug} 元数据:`, metadata);
                
                // 添加到博客列表
                blogPosts.push({
                    slug: slug,
                    title: metadata.title || slug,
                    date: metadata.date || new Date().toISOString().split('T')[0],
                    description: metadata.description || '暂无描述',
                    thumbnail: metadata.thumbnail || '',
                    tags: metadata.tags || []
                });
            } catch (error) {
                console.error(`获取博客 ${slug} 失败:`, error);
            }
        }
        
        // 按日期排序
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        console.log('排序后的博客列表:', blogPosts);
        
        // 渲染博客卡片
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

// 解析Markdown文件，分离元数据和内容
function parseMarkdown(markdown) {
    // 检查是否有HTML注释形式的元数据
    const commentRegex = /<!--\s*([\s\S]*?)\s*-->\s*([\s\S]*)/;
    const matches = markdown.match(commentRegex);
    
    if (!matches) {
        // 如果没有元数据块，就直接返回内容
        return {
            metadata: {
                title: '未命名文章',
                date: new Date().toISOString().split('T')[0],
                tags: []
            },
            content: markdown
        };
    }
    
    const metadataText = matches[1];
    const content = matches[2];
    
    // 解析元数据
    const metadata = {};
    metadataText.split('\n').forEach(line => {
        if (line.trim() && line.includes(':')) {
            const [key, ...valueParts] = line.split(':');
            let value = valueParts.join(':').trim();
            
            // 处理数组格式 [item1, item2]
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1)
                    .split(',')
                    .map(item => item.trim().replace(/'/g, '').replace(/"/g, ''));
            }
            
            metadata[key.trim()] = value;
        }
    });
    
    return { metadata, content };
}

// 创建博客卡片
function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';
    
    // 格式化日期
    const dateObj = new Date(post.date);
    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    
    // 处理缩略图路径
    let thumbnailPath = post.thumbnail || 'assets/blog-default.jpg';
    
    // 创建博客卡片HTML
    card.innerHTML = `
        <div class="shine-effect"></div>
        <a href="blog-post.html?slug=${post.slug}" class="blog-card-image-link">
            <img src="${thumbnailPath}" alt="${post.title}" class="blog-card-image">
        </a>
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

// 3D倾斜效果初始化
function initTiltEffect() {
    // 获取所有博客卡片图片链接
    const cardImages = document.querySelectorAll('.blog-card-image-link, .related-post-image-link');
    
    cardImages.forEach(card => {
        // 为每个卡片添加鼠标事件
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
}

// 处理倾斜效果
function handleTilt(e) {
    const card = this;
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    
    // 计算鼠标在卡片上的位置（从中心点为原点）
    const mouseX = e.clientX - cardRect.left - cardWidth / 2;
    const mouseY = e.clientY - cardRect.top - cardHeight / 2;
    
    // 计算倾斜角度（最大15度）
    const tiltX = (mouseY / cardHeight) * 15;
    const tiltY = -(mouseX / cardWidth) * 15;
    
    // 应用变换
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // 添加发光效果（可选）
    const glowX = (mouseX / cardWidth) * 20;
    const glowY = (mouseY / cardHeight) * 20;
    
    // 找到图片元素并应用变换
    const image = card.querySelector('img');
    if (image) {
        image.style.transform = `translate3d(${glowX}px, ${glowY}px, 30px)`;
    }
}

// 重置倾斜效果
function resetTilt() {
    this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    
    // 重置图片位置
    const image = this.querySelector('img');
    if (image) {
        image.style.transform = 'translate3d(0, 0, 0)';
    }
} 