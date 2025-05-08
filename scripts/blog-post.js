// 博客文章详情页JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画库
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });
    
    // 配置Marked，用于解析Markdown
    configureMarked();
    
    // 获取并渲染博客文章
    const slug = getUrlParameter('slug');
    if (slug) {
        loadBlogPost(slug);
        loadRelatedPosts(slug);
        
        // 设置编辑链接
        setupEditLink(slug);
    } else {
        showError('没有指定文章');
    }
    
    // 初始化滚动进度
    initScrollProgress();
});

// 配置Marked解析器
function configureMarked() {
    // 设置可选项
    marked.setOptions({
        renderer: new marked.Renderer(),
        highlight: function(code, language) {
            const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
            return hljs.highlight(validLanguage, code).value;
        },
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
    });
}

// 设置编辑链接
function setupEditLink(slug) {
    const editLink = document.getElementById('edit-post-link');
    if (editLink) {
        // GitHub编辑链接
        const githubEditUrl = `https://github.com/vladelaina/vladelaina/edit/gh-pages/blogs/${slug}.md`;
        editLink.href = githubEditUrl;
        
        // 添加点击事件，追踪编辑点击
        editLink.addEventListener('click', function(e) {
            console.log(`编辑文章: ${slug}`);
        });
    }
}

// 加载博客文章
async function loadBlogPost(slug) {
    try {
        // 从GitHub获取文章内容
        const githubUrl = `https://raw.githubusercontent.com/vladelaina/vladelaina/gh-pages/blogs/${slug}.md`;
        const response = await fetch(githubUrl);
        if (!response.ok) {
            throw new Error('文章不存在');
        }
        
        const markdownContent = await response.text();
        
        // 解析文章元数据和内容
        const { metadata, content } = parseMarkdown(markdownContent);
        
        // 设置页面标题
        document.title = `${metadata.title} - vladelaina博客`;
        document.getElementById('blog-title').textContent = `${metadata.title} - vladelaina博客`;
        
        // 渲染文章标题和元数据
        document.getElementById('post-title').textContent = metadata.title;
        document.getElementById('post-date').innerHTML = `<i class="far fa-calendar-alt"></i> ${formatDate(metadata.date)}`;
        
        // 渲染标签
        const tagsContainer = document.getElementById('post-tags');
        tagsContainer.innerHTML = '';
        if (metadata.tags && metadata.tags.length > 0) {
            metadata.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'post-tag';
                tagEl.textContent = tag;
                tagsContainer.appendChild(tagEl);
            });
        }
        
        // 渲染文章内容
        document.getElementById('blog-post-content').innerHTML = marked.parse(content);
        
        // 设置分享链接
        setupShareLinks(metadata.title);
        
        // 处理代码高亮
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block);
        });
        
        // 处理图片点击预览
        setupImagePreviews();
    } catch (error) {
        console.error('加载文章失败:', error);
        showError('加载文章失败，请稍后再试');
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

// 加载相关文章
async function loadRelatedPosts(currentSlug) {
    try {
        const container = document.getElementById('related-posts-container');
        
        // 从GitHub获取索引文件
        const indexUrl = 'https://raw.githubusercontent.com/vladelaina/vladelaina/gh-pages/blogs/index.md';
        const response = await fetch(indexUrl);
        let indexContent = '';
        
        if (response.ok) {
            indexContent = await response.text();
            
            // 简单处理索引文件，获取所有文章列表
            const blogList = indexContent.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    // 从格式 "1. Git" 中提取出 "Git"
                    const match = line.match(/\d+\.\s+(.*)/);
                    return match ? match[1].trim() : null;
                })
                .filter(slug => slug && slug !== currentSlug);
            
            // 如果没有其他文章，隐藏相关文章区域
            if (blogList.length === 0) {
                document.querySelector('.related-posts-section').style.display = 'none';
                return;
            }
            
            // 随机选择最多3篇相关文章
            const relatedSlugs = blogList
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            
            // 清空容器
            container.innerHTML = '';
            
            // 为每个相关文章创建一个卡片
            for (const slug of relatedSlugs) {
                try {
                    // 获取文章信息
                    const postUrl = `https://raw.githubusercontent.com/vladelaina/vladelaina/gh-pages/blogs/${slug}.md`;
                    const postResponse = await fetch(postUrl);
                    
                    if (postResponse.ok) {
                        const postContent = await postResponse.text();
                        const { metadata } = parseMarkdown(postContent);
                        
                        // 创建相关文章卡片
                        const postCard = document.createElement('div');
                        postCard.className = 'related-post-card';
                        
                        postCard.innerHTML = `
                            <img src="${metadata.thumbnail || 'assets/blog-default.jpg'}" alt="${metadata.title}" class="related-post-image">
                            <div class="related-post-content">
                                <h3 class="related-post-title"><a href="blog-post.html?slug=${slug}">${metadata.title}</a></h3>
                                <span class="related-post-date"><i class="far fa-calendar-alt"></i> ${formatDate(metadata.date)}</span>
                            </div>
                        `;
                        
                        container.appendChild(postCard);
                    }
                } catch (error) {
                    console.error(`获取相关文章 ${slug} 失败:`, error);
                }
            }
            
            // 如果没有成功加载任何相关文章，隐藏区域
            if (container.children.length === 0) {
                document.querySelector('.related-posts-section').style.display = 'none';
            }
        } else {
            document.querySelector('.related-posts-section').style.display = 'none';
        }
    } catch (error) {
        console.error('加载相关文章失败:', error);
        document.querySelector('.related-posts-section').style.display = 'none';
    }
}

// 设置分享链接
function setupShareLinks(title) {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(title);
    
    document.getElementById('twitter-share').href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    document.getElementById('facebook-share').href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    document.getElementById('linkedin-share').href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
}

// 设置图片点击预览
function setupImagePreviews() {
    const images = document.querySelectorAll('.blog-post-content img');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

// 打开图片预览模态框
function openImageModal(src, alt) {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img src="${src}" alt="${alt || '图片预览'}">
            <p>${alt || ''}</p>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 阻止滚动
    document.body.style.overflow = 'hidden';
    
    // 显示模态框
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 关闭模态框
    const closeButton = modal.querySelector('.image-modal-close');
    closeButton.addEventListener('click', () => closeImageModal(modal));
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal(modal);
        }
    });
}

function closeImageModal(modal) {
    modal.style.opacity = '0';
    
    setTimeout(() => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }, 300);
}

// 显示错误信息
function showError(message) {
    const container = document.getElementById('blog-post-content');
    container.innerHTML = `
        <div class="error-message">
            <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
        </div>
    `;
}

// 获取URL参数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 格式化日期
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', options);
    } catch {
        return dateString;
    }
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