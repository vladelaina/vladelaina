// 网站多语言支持
const translations = {
    'zh': {
        // 导航和切换按钮
        'switchLanguage': '切换语言',
        'languageEN': 'English',
        'languageZH': '中文',
        
        // 标题
        'pageTitle': 'vladelaina',
        
        // 英雄区域
        'heroSubtitle': '信仰开源之道，崇尚 Arch 之美，沉溺二次元世界',
        'heroDescription': '代码是诗，终端是画布，内核如灵魂般自由。喜欢折腾，不怕重构，享受每一次从零开始的过程。用 Nvim 写情书，用 Git 记录心跳，人生就像一部番剧，每一季都值得期待。',
        'contactMe': '联系我',
        'viewResume': '查看简历',
        
        // 关于我
        'aboutMe': '关于我',
        'aboutMyName': '关于我的名字',
        'aboutNameDesc1': '"Vladelaina" 是结合了我最喜欢的两部动漫女主角的名字——《86-不存在的战区-》中的 Vladilena Milizé 和《魔女之旅》中的 Elaina。',
        'aboutNameDesc2': '如果你还没看过这两部作品，真心推荐你去看看，剧情和角色都非常精彩，绝对值得一追！',
        'animeTitle1': '86',
        'animeTitle2': '魔女之旅',
        
        // 项目展示
        'projects': '项目展示',
        'projectsSubtitle': '我参与或独立完成的一些项目',
        'catimeDesc': '一款简洁的Windows倒计时工具，支持番茄时钟功能，具有透明界面和丰富的自定义选项。该项目在GitHub上获得了1.4k+的星标。',
        'officialWebsite': '官方网站',
        'viewSource': '查看源码',
        'comingSoon': '待续',
        'tagC': 'C',
        'tagWindows': 'Windows',
        'tagDesktopTool': '桌面工具',
        
        // 技能栈
        'skills': '技能栈',
        'skillsSubtitle': '我掌握的一些技术和工具',
        'frontendTech': '前端技术',
        'frontendSkills': 'HTML, CSS, JavaScript',
        'programmingLanguages': '编程语言',
        'programmingSkills': 'C',
        'systemAndEnvironment': '系统 & 环境',
        'systemSkills': 'Arch Linux, wezterm',
        'toolsAndOthers': '工具 & 其他',
        'toolsSkills': 'Nvim, Git',
        
        // 联系我
        'contact': '联系我',
        'contactSubtitle': '欢迎通过以下方式与我交流',
        'email': '邮箱',
        'github': 'GitHub',
        'bilibili': 'Bilibili',
        
        // 页脚
        'copyright': '© 2024 vladelaina. All Rights Reserved.',
        
        // 其他
        'backToTop': '返回顶部',
        'copyCode': '复制',
        'copied': '已复制'
    },
    'en': {
        // Navigation and toggle button
        'switchLanguage': 'Switch Language',
        'languageEN': 'English',
        'languageZH': '中文',
        
        // Title
        'pageTitle': 'vladelaina - Personal Site',
        
        // Hero section
        'heroSubtitle': 'Open source believer, Arch Linux enthusiast, anime lover',
        'heroDescription': 'Code is poetry, terminal is canvas, kernel is freedom of soul. Love tinkering, embrace refactoring, and enjoy every fresh start. Writing love letters with Nvim, recording heartbeats with Git, life is like an anime series - every season is worth looking forward to.',
        'contactMe': 'Contact Me',
        'viewResume': 'View Resume',
        
        // About me
        'aboutMe': 'About Me',
        'aboutMyName': 'About My Name',
        'aboutNameDesc1': '"Vladelaina" is a combination of my favorite anime protagonists - Vladilena Milizé from "86 -Eighty Six-" and Elaina from "Wandering Witch: The Journey of Elaina".',
        'aboutNameDesc2': 'If you haven\'t watched these two anime yet, I highly recommend them. The storylines and characters are fantastic and absolutely worth following!',
        'animeTitle1': '86',
        'animeTitle2': 'Wandering Witch',
        
        // Projects
        'projects': 'Projects',
        'projectsSubtitle': 'Projects I\'ve participated in or completed independently',
        'catimeDesc': 'A minimalist Windows countdown tool with Pomodoro function, featuring a transparent interface and rich customization options. This project has received over 1.4k stars on GitHub.',
        'officialWebsite': 'Official Website',
        'viewSource': 'View Source',
        'comingSoon': 'Coming Soon',
        'tagC': 'C',
        'tagWindows': 'Windows',
        'tagDesktopTool': 'Desktop Tool',
        
        // Skills
        'skills': 'Skills',
        'skillsSubtitle': 'Technologies and tools I\'m proficient with',
        'frontendTech': 'Frontend',
        'frontendSkills': 'HTML, CSS, JavaScript',
        'programmingLanguages': 'Programming Languages',
        'programmingSkills': 'C',
        'systemAndEnvironment': 'System & Environment',
        'systemSkills': 'Arch Linux, wezterm',
        'toolsAndOthers': 'Tools & Others',
        'toolsSkills': 'Nvim, Git',
        
        // Contact
        'contact': 'Contact',
        'contactSubtitle': 'Feel free to reach out to me through these channels',
        'email': 'Email',
        'github': 'GitHub',
        'bilibili': 'Bilibili',
        
        // Footer
        'copyright': '© 2024 vladelaina. All Rights Reserved.',
        
        // Others
        'backToTop': 'Back to Top',
        'copyCode': 'Copy',
        'copied': 'Copied'
    }
};

// 当前语言
let currentLang = 'zh';

// 获取翻译文本的函数
function t(key) {
    return translations[currentLang][key] || key;
}

// 切换语言
function switchLanguage(lang) {
    if (lang && translations[lang]) {
        currentLang = lang;
        updatePageContent();
        
        // 记录到控制台
        console.log(`语言已切换至: ${lang}`);
    }
}

// 更新页面内容
function updatePageContent() {
    // 更新页面标题
    document.title = t('pageTitle');
    
    // 根据数据属性更新所有可翻译元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // 更新有placeholder的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // 更新按钮等元素内的内容
    document.querySelectorAll('[data-i18n-inner]').forEach(element => {
        const key = element.getAttribute('data-i18n-inner');
        element.innerHTML = t(key);
    });
    
    // 更新具有title属性的元素
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
}

// 初始化语言设置
function initLanguage() {
    // 获取浏览器语言
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 如果浏览器语言是中文，使用中文，否则使用英文
    if (browserLang && browserLang.startsWith('zh')) {
        currentLang = 'zh';
    } else {
        currentLang = 'en';
    }
    
    // 应用初始语言
    updatePageContent();
    
    // 记录到控制台
    console.log(`根据浏览器语言(${browserLang})自动选择: ${currentLang}`);
}

// 导出函数和变量
window.i18n = {
    t,
    switchLanguage,
    updatePageContent,
    initLanguage,
    currentLang
}; 