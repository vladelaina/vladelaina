// 主页相关的JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画库
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });
    
    // 初始化滚动进度
    initScrollProgress();
    
    // 初始化3D倾斜效果
    initTiltEffect();
});

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

// 初始化3D倾斜效果
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