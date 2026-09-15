// 主页相关的JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画库
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });
    
    // 初始化滚动进度

    
    // 初始化3D倾斜效果
    initTiltEffect();
});

// 初始化滚动进度


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
