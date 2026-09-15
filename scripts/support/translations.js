function addSupportTranslations() {
    const language = getCurrentLanguage();
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
    fixButtonPositions();
    if (language !== 'en') return;
    document.getElementById('page-title').textContent = 'vladelaina - Sponsor Developer';
    document.getElementById('meta-description').content = 'Sponsor vladelaina and support the development and maintenance of open-source projects including Catime, BongoCat, and vlaina.';
    translateSupportElements();
    fixButtonVisibility();
}

function fixButtonPositions() {
    setTimeout(() => {
        document.querySelectorAll('.support-card .support-btn').forEach(btn => {
            btn.style.position = 'absolute';
            btn.style.bottom = window.innerWidth <= 480 ? '2rem' : '2.5rem';
            btn.style.left = '50%';
            btn.style.transform = 'translateX(-50%)';
            btn.style.width = '200px';
            btn.style.margin = '0';
        });
    }, 100);
}

function fixButtonVisibility() {
    document.querySelectorAll('.support-card .support-btn').forEach(btn => {
        setSupportButtonVisible(btn);
    });
    
    const issuesBtn = document.querySelector('.support-card:nth-child(2) .support-btn');
    if (issuesBtn) {
        setSupportButtonVisible(issuesBtn);
        
        if (issuesBtn.querySelector('i')) {
            issuesBtn.querySelector('i').style.display = 'inline-block';
        }
    }
}

function setSupportButtonVisible(btn) {
    btn.style.display = 'flex';
    btn.style.visibility = 'visible';
    btn.style.opacity = '1';
}

function translateSupportElements() {
    const sectionTitleTranslations = {
        '支持项目': 'Support the Project <i class="fas fa-mug-hot"></i>',
        '其他支持方式': 'Other Ways to Support <i class="fas fa-gift"></i>',
        '感谢支持者': 'Thanks to Supporters',
    };

    CatimeUI.setInnerHTMLWhenIncludes('.section-title', sectionTitleTranslations);
    
    const projectDesc = document.querySelector('.support-project .section-subtitle');
    if (projectDesc) {
        projectDesc.innerHTML = 'From Catime and BongoCat to vlaina, every project begins with passion.<br>' +
            'Turning an idea into a useful tool takes time and effort.<br>' +
            'If these creations have made your life easier or brought you joy, consider buying the author a coffee,<br>' +
            'to fuel this passion ❤️‍🔥<br>' +
            'Every bit of your support helps these projects keep moving forward!';
    }
    
    const supportLabelTranslations = {
        '微信': '<i class="fab fa-weixin"></i> WeChat',
        '支付宝': '<i class="fab fa-alipay"></i> Alipay',
    };

    CatimeUI.setInnerHTMLWhenIncludes('.support-label', supportLabelTranslations);

    const wechatQr = document.querySelector('.wechat-qr');
    if (wechatQr) {
        wechatQr.alt = 'WeChat Pay';
    }

    const alipayQr = document.querySelector('.alipay-qr');
    if (alipayQr) {
        alipayQr.alt = 'Alipay';
    }

    const kofiButton = document.querySelector('.kofi-official-button');
    if (kofiButton) {
        kofiButton.alt = 'Support me on Ko-fi';
    }

    const starCardTranslation = {
        title: 'Star Project',
        description: 'Enjoy Catime, BongoCat, or vlaina? Give your favorite projects a Star on GitHub. Every star is an encouragement!',
        buttonHtml: '<i class="fab fa-github"></i> Choose a Project',
    };
    const issueCardTranslation = {
        title: 'Submit Issues',
        description: 'Found a bug or have an idea? Open an issue in the relevant GitHub repository to help us make these tools better!',
        buttonHtml: '<i class="fas fa-exclamation-circle"></i> Choose a Project',
        forceVisible: true,
    };
    const cardTranslations = {
        '点亮 Star': starCardTranslation,
        'Star 项目': starCardTranslation,
        '提交反馈': issueCardTranslation,
        '提交Issues': issueCardTranslation,
        '分享推广': {
            title: 'Share & Promote',
            description: 'Share Catime, BongoCat, and vlaina with friends, colleagues, or on social media to help more people discover these creations!',
            buttonHtml: '<i class="fas fa-users"></i> View Projects',
            href: '#open-projects',
        },
    };

    const supportCards = document.querySelectorAll('.support-card');
    supportCards.forEach(card => {
        const title = card.querySelector('h3');
        const desc = card.querySelector('p');
        const btn = card.querySelector('.support-btn');

        const translation = title ? cardTranslations[title.textContent] : null;
        if (!translation) return;

        title.textContent = translation.title;
        desc.textContent = translation.description;

        if (btn) {
            btn.innerHTML = translation.buttonHtml;
            if (translation.href) {
                btn.href = translation.href;
            }
        }

        if (translation.forceVisible && btn) {
            setSupportButtonVisible(btn);
        }
    });



    const totalLabel = document.querySelector('.support-total-label');
    if (totalLabel) {
        totalLabel.innerHTML = '<i class="fas fa-coins"></i> Total Donations';
    }

    const countLabel = document.querySelector('.support-count-label');
    if (countLabel) {
        countLabel.innerHTML = '<i class="fas fa-user-friends"></i> Supporters';
    }
    
    const tableHeaders = document.querySelectorAll('.supporters-table th');
    if (tableHeaders.length >= 4) {
        ['Time', 'Username', 'Amount', 'Message'].forEach((text, index) => {
            tableHeaders[index].textContent = text;
        });
    }
    
    const supporterCellTranslations = {
        '支持你产出更好更多的学习工具（钱少，一点点心意啦。）': 'Supporting you in creating more and better learning tools (It is not much, just a small token of appreciation.)',
        '简单好用': 'Simple and easy to use',
        'vlaina提了一把需求，开工了开工了': 'vlaina made a feature request—time to get to work!',
        'vlaina加油做': 'Keep it up, vlaina!',
        '一切努力终将迎来胜利的曙光': 'Every effort will eventually be rewarded with the dawn of victory',
        'catime很可爱哦': 'Catime is so cute!',
        '感谢UP主开源': 'Thank you for open-sourcing this project!',
        '功能简洁 实用便利 赞': 'Simple, practical, and convenient. Great!',
        '喝咖啡': 'Coffee',
        '软件做得好棒，要一直热爱下去呀': 'The software is wonderfully made. Keep that passion alive!',
        '1.4版本太好了': 'Version 1.4 is great',
        '坚持就是胜利': 'Perseverance leads to victory',
        '加油': 'Keep going',
        '加油啊，你可以的': 'Come on, you can do it!',
        '加油，你可以的🫡': 'Keep going, you can do it! 🫡',
        '好用，爱用，希望增加个鼠标悬停时隐藏时钟的功能': 'Love it! Hope to add a feature to hide the clock when hovering with mouse',
        '催更催更😏': 'Push for updates😏',
        '番茄钟超赞，期待继续优化': 'Pomodoro timer is great, looking forward to further optimization',
        '很棒的项目！': 'Great project!',
        '恭喜': 'Congratulations',
        '感谢Catime，希望你也能多爱自己，未来可期': 'Thank you Catime, hope you also love yourself more, the future is promising',
        '建议catime加个倒计时列表功能': 'Suggest adding a countdown list feature to catime',
        '赞助了一年的域名 vladelaina.com': 'Sponsored one year of domain vladelaina.com',
        '打赏catime': 'Tipping catime',
        'catime打赏': 'Tipping catime',
        '支持catime': 'Support catime',
        '软件好用，赞赞赞': 'The software is great, praise!',
        '软件很好用，感谢你的坚持[爱心]': 'The software is very useful, thank you for your persistence [heart]',
        '极简，可爱，好用，喜欢': 'Minimalist, cute, useful, love it',
        '不错不错，实用鼓励一下': 'Not bad, very practical, a little encouragement',
        '在任务栏里吃灰叭（bushi）好用👍': "Let it collect dust in the taskbar (just kidding) It's great👍",
        '学生党，1块冲你和我一样喜欢蕾娜和伊蕾娜，1块冲你的产品确实挺好': 'As a student, ¥1 because you like Laina and Elaina like me, another ¥1 because your product is really good',
        '我是最早提出来让你弄这个二维码，我们粉丝可以赞助': 'I was the first to suggest setting up these QR codes so we fans could support you',
        '不多感谢你的catime，让我下班有了倒计时盼头🤧': 'Just wanted to thank you for catime, it gives me something to look forward to counting down to when getting off work🤧',
        '为爱发电': 'Powered by love',
        'catime小小支持': 'A little support for catime',
        '支持一下': 'Just a little support',
        '茉莉蜜茶行不行': 'How about jasmine honey tea',
        '好喜欢catime，请你喝奶茶': 'I really like catime, please have some milk tea',
        '时钟很不错，帮助页面也很漂亮 支持~*.。(๑･∀･๑)*.。': 'The timer is great, and the help page is beautiful. Support~*.。(๑･∀･๑)*.。',
        'bro好用狒狒防沉迷组件了已经是': "Bro, it's so useful! Already has anti-addiction component",
        '非常好的工具，谢谢': 'Very good tool, thank you',
        '功能简洁明了，谢谢你，cat': 'Simple and clear features, thank you, cat',
        '好用，respect': 'Useful, respect',
        '感谢 catime，好用。': 'Thanks to Catime, easy to use.',
        '入股入股，付费使用来自律': 'Investing, paying for self-discipline.',
        '非常好小程序': 'Very good app',
        '我是葱葱哦，想给你加个油，祝你的软件越做越好！': 'I am Congcong, just wanted to cheer you on. Hope your software keeps getting better and better!'
    };

    document.querySelectorAll('.supporters-table td').forEach(td => {
        const translatedText = supporterCellTranslations[td.textContent];
        if (translatedText) {
            td.textContent = translatedText;
        }
        
        if (td.parentElement && td.cellIndex === 3) { 
            td.style.maxWidth = '250px';
            td.style.wordWrap = 'break-word';
            td.style.whiteSpace = 'normal';
            
            if (getCurrentLanguage() === 'en') {
                td.style.fontSize = '0.9rem';
                td.style.lineHeight = '1.4';
            }
        }
    });
}
