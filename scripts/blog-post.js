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
    // 创建自定义渲染器
    const renderer = new marked.Renderer();
    
    // 自定义链接渲染逻辑，添加target="_blank"属性使链接在新窗口打开
    renderer.link = function(href, title, text) {
        const link = `<a href="${href}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ''}>${text}</a>`;
        return link;
    };
    
    // 自定义图片渲染逻辑，处理相对路径
    renderer.image = function(href, title, text) {
        // 处理相对路径图片
        if (href.startsWith('./Images/') || href.startsWith('Images/')) {
            // 移除开头的./
            const imagePath = href.replace(/^\.\//, '');
            // 将空格替换为%20
            const encodedPath = imagePath.replace(/ /g, '%20');
            // 构建本地图片URL
            href = `blogs/${encodedPath}`;
        }
        
        const alt = text || '';
        const titleAttr = title ? ` title="${title}"` : '';
        
        return `<img src="${href}" alt="${alt}"${titleAttr}>`;
    };
    
    // 设置可选项
    marked.setOptions({
        renderer: renderer,
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
    
    // 添加图片路径处理钩子
    const originalParse = marked.parse;
    marked.parse = function(markdown, options) {
        // 先进行常规渲染
        let html = originalParse.call(this, markdown, options);
        
        // 使用正则表达式查找包含相对路径的图片标签
        const imgRegex = /<img\s+src="(\.\/Images\/[^"]+)"\s*([^>]*)>/g;
        
        // 替换找到的图片路径
        html = html.replace(imgRegex, function(match, src, attributes) {
            // 处理路径
            const imagePath = src.replace(/^\.\//, '');
            const encodedPath = imagePath.replace(/ /g, '%20');
            const newSrc = `blogs/${encodedPath}`;
            
            return `<img src="${newSrc}" ${attributes}>`;
        });
        
        // 使用正则表达式查找iframe标签，将其包裹在响应式容器中
        const iframeRegex = /<iframe[^>]*><\/iframe>/g;
        html = html.replace(iframeRegex, function(match) {
            return `<div class="video-container">${match}</div>`;
        });
        
        return html;
    };
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
        // 从本地获取文章内容
        const localUrl = `blogs/${slug}.md`;
        console.log('尝试获取文章:', localUrl);
        
        const response = await fetch(localUrl);
        if (!response.ok) {
            console.error('文章请求失败，状态码:', response.status);
            throw new Error('文章不存在');
        }
        
        const markdownContent = await response.text();
        console.log('文章内容前100个字符:', markdownContent.substring(0, 100));
        
        // 解析文章元数据和内容
        const { metadata, content } = parseMarkdown(markdownContent);
        console.log('解析出的元数据:', metadata);
        console.log('内容前100个字符:', content.substring(0, 100));
        
        // 设置页面标题
        document.title = `${metadata.title} - vladelaina`;
        document.getElementById('blog-title').textContent = `${metadata.title} - vladelaina`;
        
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
        
        // 处理代码高亮
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block);
            
            // 获取代码文本
            const codeText = block.textContent.trim();
            const lines = codeText.split('\n');
            const firstLine = lines[0];
            
            // 检查是否是emoji提交格式的代码块
            const emojiCommitPattern = /^[^\s]+\s+[a-z]+(\([^)]*\))?: .+$/;
            const isEmojiCommit = emojiCommitPattern.test(firstLine);
            
            // 如果是emoji提交格式，添加特殊类名
            if (isEmojiCommit) {
                block.parentNode.classList.add('emoji-commit');
            }
            
            // 为所有代码块添加复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-button';
            copyBtn.innerHTML = `<i class="far fa-copy"></i> ${window.i18n.t('copyCode')}`;
            
            // 添加复制功能
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(codeText).then(() => {
                    // 显示复制成功状态
                    copyBtn.classList.add('copied');
                    copyBtn.innerHTML = `<i class="fas fa-check"></i> ${window.i18n.t('copied')}`;
                    
                    // 2秒后恢复原状
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.innerHTML = `<i class="far fa-copy"></i> ${window.i18n.t('copyCode')}`;
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            });
            
            // 将按钮添加到pre标签中
            block.parentNode.appendChild(copyBtn);
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
        
        // 从本地获取索引文件
        const indexUrl = 'blogs/index.md';
        const response = await fetch(indexUrl);
        
        if (!response.ok) {
            throw new Error('无法获取博客索引');
        }
        
        const indexContent = await response.text();
        
        // 解析索引文件获取博客列表
        const blogSlugs = indexContent.split('\n')
            .filter(line => line.trim())
            .map(line => {
                // 从格式 "1. Git" 中提取出 "Git"
                const match = line.match(/\d+\.\s+(.*)/);
                return match ? match[1].trim() : null;
            })
            .filter(slug => slug)
            .filter(slug => slug !== currentSlug);  // 排除当前文章
            
        // 如果没有相关文章
        if (blogSlugs.length === 0) {
            container.innerHTML = '<p data-i18n="noRelatedPosts">暂无相关文章</p>';
            return;
        }
        
        // 存储所有相关文章的数据
        const relatedPosts = [];
        
        // 获取每篇博客的详细信息（最多3篇）
        for (const slug of blogSlugs.slice(0, 3)) {
            try {
                // 获取文章内容
                const postUrl = `blogs/${slug}.md`;
                const postResponse = await fetch(postUrl);
                
                if (postResponse.ok) {
                    const postContent = await postResponse.text();
                    const { metadata } = parseMarkdown(postContent);
                    
                    // 添加到相关文章列表
                    relatedPosts.push({
                        slug: slug,
                        title: metadata.title || slug,
                        date: metadata.date || new Date().toISOString().split('T')[0],
                        thumbnail: metadata.thumbnail || ''
                    });
                }
            } catch (error) {
                console.error(`获取相关博客 ${slug} 失败:`, error);
            }
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 渲染相关文章
        if (relatedPosts.length > 0) {
            relatedPosts.forEach(post => {
                const relatedPostEl = document.createElement('div');
                relatedPostEl.className = 'related-post';
                
                // 格式化日期
                const dateObj = new Date(post.date);
                const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                
                relatedPostEl.innerHTML = `
                    <a href="blog-post.html?slug=${post.slug}" class="related-post-image-link">
                        <img src="${post.thumbnail || 'assets/blog-default.jpg'}" alt="${post.title}" class="related-post-image">
                    </a>
                    <div class="related-post-content">
                        <h3 class="related-post-title"><a href="blog-post.html?slug=${post.slug}">${post.title}</a></h3>
                        <span class="related-post-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
                    </div>
                `;
                
                container.appendChild(relatedPostEl);
            });
            
            // 添加3D倾斜效果
            initTiltEffect();
        } else {
            container.innerHTML = '<p data-i18n="noRelatedPosts">暂无相关文章</p>';
        }
    } catch (error) {
        console.error('加载相关文章失败:', error);
        container.innerHTML = '<p data-i18n="loadRelatedPostsError">加载相关文章失败</p>';
    }
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
    
    // 显示模态框，但不阻止页面滚动
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
    
    // 关闭模态框的函数
    function closeModalWithoutAnimation() {
        modal.style.opacity = '0';
        
        // 设置标记，表示正在关闭模态框
        modal.dataset.closing = 'true';
        
        // 延迟清理
        setTimeout(() => {
            // 移除模态框
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        }, 300);
    }
    
    // 关闭按钮点击事件
    const closeButton = modal.querySelector('.image-modal-close');
    closeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModalWithoutAnimation();
    });
    
    // 点击背景关闭
    modal.addEventListener('click', function(e) {
        if (e.target === modal && !modal.dataset.closing) {
            closeModalWithoutAnimation();
        }
    });
    
    // 阻止模态框内图片点击冒泡
    const modalImg = modal.querySelector('img');
    modalImg.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // ESC键关闭
    function escHandler(e) {
        if (e.key === 'Escape' && !modal.dataset.closing) {
            closeModalWithoutAnimation();
            document.removeEventListener('keydown', escHandler);
        }
    }
    document.addEventListener('keydown', escHandler);
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