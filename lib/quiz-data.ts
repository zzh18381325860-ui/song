// 性格维度：浪漫度(R)、内敛度(I)、感伤度(S)、追梦度(D)、洒脱度(F)
// 每首歌有一个性格画像，每个维度 0~10
// 测评题目测量用户在这五个维度的倾向
// 最终用欧几里得距离匹配最接近的歌曲

export interface SongResult {
  id: string
  title: string
  artist: string
  album: string
  year: number
  lyricQuote: string
  description: string
  mood: string
  tags: string[]
  profile: [number, number, number, number, number] // [R, I, S, D, F]
}

export interface QuizOption {
  text: string
  scores: [number, number, number, number, number] // [R, I, S, D, F]
}

export interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "深夜独处时，你最可能在做什么？",
    options: [
      { text: "翻看旧照片，回忆过去的人和事", scores: [7, 6, 8, 2, 2] },
      { text: "戴上耳机，听歌发呆看窗外", scores: [5, 8, 5, 3, 4] },
      { text: "列一张未来计划清单，满心期待", scores: [3, 3, 1, 9, 5] },
      { text: "约朋友出来喝酒聊天，夜晚才开始", scores: [4, 1, 2, 4, 9] },
    ],
  },
  {
    id: 2,
    question: "走在街上突然下雨了，你会？",
    options: [
      { text: "淋着雨慢慢走，觉得挺浪漫的", scores: [9, 5, 4, 3, 6] },
      { text: "找个屋檐安静地等雨停", scores: [4, 9, 5, 2, 3] },
      { text: "想起某个和雨有关的人，心里一酸", scores: [7, 6, 9, 1, 1] },
      { text: "管它呢，跑起来也挺开心", scores: [3, 1, 1, 6, 9] },
    ],
  },
  {
    id: 3,
    question: "如果用一个季节形容自己，你选？",
    options: [
      { text: "春天 — 万物萌动，心里总有期待", scores: [7, 3, 2, 7, 5] },
      { text: "夏天 — 热烈奔放，不留遗憾", scores: [5, 1, 1, 6, 9] },
      { text: "秋天 — 有些萧瑟，但很美", scores: [6, 7, 8, 3, 3] },
      { text: "冬天 — 安静内敛，适合沉思", scores: [4, 9, 6, 2, 2] },
    ],
  },
  {
    id: 4,
    question: "对你来说，一段好的感情最重要的是？",
    options: [
      { text: "怦然心动的瞬间，像电影一样浪漫", scores: [10, 3, 4, 4, 4] },
      { text: "细水长流的陪伴，平淡中见真情", scores: [5, 8, 3, 2, 4] },
      { text: "彼此成长，一起追逐各自的梦", scores: [4, 3, 1, 9, 5] },
      { text: "自由和信任，不互相束缚", scores: [3, 4, 2, 5, 9] },
    ],
  },
  {
    id: 5,
    question: "你最害怕的事情是？",
    options: [
      { text: "被遗忘，好像从没存在过", scores: [6, 5, 8, 5, 1] },
      { text: "一成不变地过完一生", scores: [3, 2, 2, 9, 7] },
      { text: "失去最在乎的人", scores: [8, 5, 9, 1, 1] },
      { text: "不能做真实的自己", scores: [4, 6, 3, 5, 8] },
    ],
  },
  {
    id: 6,
    question: "旅行时你更倾向于？",
    options: [
      { text: "去一个没人认识你的地方，重新开始", scores: [4, 6, 4, 6, 8] },
      { text: "和喜欢的人一起，去哪都行", scores: [9, 4, 3, 3, 5] },
      { text: "独自背包旅行，走到哪算哪", scores: [5, 7, 3, 7, 7] },
      { text: "回到小时候生活过的地方看看", scores: [6, 6, 8, 2, 2] },
    ],
  },
  {
    id: 7,
    question: "你的朋友通常怎么形容你？",
    options: [
      { text: "温柔细腻，总是很照顾别人的感受", scores: [7, 7, 5, 2, 3] },
      { text: "有趣洒脱，跟你在一起很开心", scores: [4, 1, 1, 5, 10] },
      { text: "有想法有干劲，做事很有冲劲", scores: [2, 3, 1, 10, 5] },
      { text: "安静但深刻，说出的话总让人印象深刻", scores: [5, 9, 6, 3, 2] },
    ],
  },
  {
    id: 8,
    question: "收到一封来自过去的信，你会？",
    options: [
      { text: "小心翼翼地打开，一个字一个字读", scores: [7, 7, 8, 1, 1] },
      { text: "读完后笑笑，那些事都过去了", scores: [4, 4, 3, 3, 8] },
      { text: "感慨万千，写一封长长的回信", scores: [8, 5, 6, 3, 3] },
      { text: "当作前进的动力，更坚定地走下去", scores: [3, 4, 3, 9, 5] },
    ],
  },
  {
    id: 9,
    question: "如果可以拥有一种超能力？",
    options: [
      { text: "时光倒流，回到某个重要的时刻", scores: [7, 5, 9, 2, 2] },
      { text: "读懂别人的心，不再误解和错过", scores: [8, 6, 5, 2, 3] },
      { text: "瞬间移动，去任何想去的地方", scores: [3, 2, 1, 7, 9] },
      { text: "预知未来，提前做好准备", scores: [2, 7, 3, 8, 3] },
    ],
  },
  {
    id: 10,
    question: "以下哪种场景最让你感到幸福？",
    options: [
      { text: "午后阳光洒在书页上，咖啡还热着", scores: [5, 9, 3, 2, 4] },
      { text: "和喜欢的人并肩走在落叶的小路上", scores: [9, 5, 4, 2, 3] },
      { text: "站在山顶看日出，感觉世界都是你的", scores: [4, 3, 1, 9, 7] },
      { text: "一群朋友围着篝火唱歌到天亮", scores: [5, 1, 1, 5, 10] },
    ],
  },
  {
    id: 11,
    question: "你觉得「遗憾」这个词？",
    options: [
      { text: "是人生最刻骨铭心的味道", scores: [7, 6, 10, 2, 1] },
      { text: "是成长必须付出的代价", scores: [3, 6, 4, 7, 4] },
      { text: "让人更懂得珍惜当下", scores: [5, 5, 5, 5, 5] },
      { text: "不想留遗憾，所以什么都想试试", scores: [4, 1, 1, 8, 9] },
    ],
  },
  {
    id: 12,
    question: "如果明天是世界末日，今晚你会？",
    options: [
      { text: "去见最想见的那个人", scores: [10, 4, 6, 2, 3] },
      { text: "一个人安静地看最后一次星空", scores: [5, 10, 7, 1, 2] },
      { text: "做一件一直不敢做的疯狂事", scores: [3, 1, 1, 8, 10] },
      { text: "写一封长长的信留给这个世界", scores: [6, 7, 8, 4, 2] },
    ],
  },
  {
    id: 13,
    question: "你的人生信条最接近哪一句？",
    options: [
      { text: "爱过就不后悔，哪怕结局不完美", scores: [9, 3, 6, 4, 5] },
      { text: "与其等待，不如出发", scores: [3, 2, 1, 10, 7] },
      { text: "真正的强大是温柔", scores: [6, 8, 4, 3, 3] },
      { text: "活在当下，尽兴就好", scores: [4, 2, 1, 4, 10] },
    ],
  },
  {
    id: 14,
    question: "你更容易被哪种旋律打动？",
    options: [
      { text: "缓慢的钢琴曲，像在诉说心事", scores: [6, 8, 8, 1, 1] },
      { text: "温暖的吉他弹唱，像老朋友聊天", scores: [6, 5, 4, 3, 6] },
      { text: "激昂的摇滚，让人想振臂高呼", scores: [2, 1, 1, 9, 9] },
      { text: "空灵的人声，听着想流泪", scores: [8, 7, 7, 2, 1] },
    ],
  },
  {
    id: 15,
    question: "如果你是一本书，你觉得自己是？",
    options: [
      { text: "一本写了一半的日记", scores: [5, 7, 7, 5, 2] },
      { text: "一本浪漫的诗集", scores: [10, 6, 5, 3, 3] },
      { text: "一本热血的冒险小说", scores: [3, 1, 1, 9, 9] },
      { text: "一本淡淡的散文随笔", scores: [5, 9, 4, 2, 4] },
    ],
  },
]

export const songs: SongResult[] = [
  // 周杰伦
  {
    id: "qingtian",
    title: "晴天",
    artist: "周杰伦",
    album: "叶惠美",
    year: 2003,
    lyricQuote: "从前从前有个人爱你很久，但偏偏风渐渐把距离吹得好远",
    description: "你像一个阳光下的回忆，美好却带着淡淡的遗憾。你对感情认真而深刻，即使过去了很久，依然会在某个晴天突然想起某个人。你的浪漫不张扬，藏在日常的每一个细节里。",
    mood: "温暖怀旧",
    tags: ["青春", "怀念", "遗憾"],
    profile: [7, 5, 7, 3, 3],
  },
  {
    id: "qilixiang",
    title: "七里香",
    artist: "周杰伦",
    album: "七里香",
    year: 2004,
    lyricQuote: "窗外的麻雀在电线杆上多嘴，你说这一句很有夏天的感觉",
    description: "你是夏天的味道本身——明亮、热烈、充满生命力。你相信爱情里最美的部分是那些不经意的小事，一个眼神、一句话就能让你心动。你的感情纯粹而美好。",
    mood: "甜蜜明亮",
    tags: ["夏天", "初恋", "美好"],
    profile: [9, 4, 3, 3, 5],
  },
  {
    id: "daoxiang",
    title: "稻香",
    artist: "周杰伦",
    album: "魔杰座",
    year: 2008,
    lyricQuote: "所谓的那快乐，赤脚在田里追蜻蜓追到累了，偷摘水果被蜜蜂给叮到怕了",
    description: "你是一个内心温暖的理想主义者，相信简单纯粹的快乐。不管世界多复杂，你总能找到回归纯真的路。你像田野里的稻香，质朴、踏实、让人安心。",
    mood: "温暖治愈",
    tags: ["治愈", "纯真", "乡愁"],
    profile: [5, 4, 3, 7, 6],
  },
  {
    id: "jiandanai",
    title: "简单爱",
    artist: "周杰伦",
    album: "范特西",
    year: 2001,
    lyricQuote: "想说的话来不及说的太多，你用微笑带过",
    description: "你追求的是最纯粹的感情，不需要什么惊天动地，只要两个人在一起就好。你有一种让人放松的气质，和你在一起的人总觉得很舒服。简单，就是你最大的魅力。",
    mood: "清新自然",
    tags: ["简单", "青春", "甜蜜"],
    profile: [7, 3, 2, 3, 7],
  },
  {
    id: "anjing",
    title: "安静",
    artist: "周杰伦",
    album: "范特西",
    year: 2001,
    lyricQuote: "只剩下钢琴陪我谈了一天，睡着的大提琴，安静的旧旧的",
    description: "你的内心世界比海还深。你不擅长表达，但感受比任何人都深刻。你会把心事藏在安静里，用沉默来消化那些说不出口的情感。你的温柔，只有真正靠近的人才知道。",
    mood: "沉静忧伤",
    tags: ["孤独", "深情", "内敛"],
    profile: [5, 9, 8, 1, 1],
  },
  {
    id: "qinghuaci",
    title: "青花瓷",
    artist: "周杰伦",
    album: "我很忙",
    year: 2007,
    lyricQuote: "天青色等烟雨，而我在等你",
    description: "你骨子里有一种古典的优雅。你欣赏美的事物，对生活有自己独特的品味。你的等待不是被动的，而是一种从容的坚定——你相信，对的人终会出现。",
    mood: "古典唯美",
    tags: ["古风", "等待", "唯美"],
    profile: [8, 8, 5, 2, 2],
  },
  {
    id: "yequ",
    title: "夜曲",
    artist: "周杰伦",
    album: "十一月的萧邦",
    year: 2005,
    lyricQuote: "为你弹奏萧邦的夜曲，纪念我死去的爱情",
    description: "你是夜晚的灵魂，在黑暗中反而更加清醒和敏锐。你用艺术的方式纪念每一段感情，把伤痛化为创作的灵感。你浪漫而忧郁，像一首永远弹不完的夜曲。",
    mood: "忧郁浪漫",
    tags: ["夜晚", "忧郁", "艺术"],
    profile: [8, 7, 8, 3, 1],
  },
  {
    id: "dongfengpo",
    title: "东风破",
    artist: "周杰伦",
    album: "叶惠美",
    year: 2003,
    lyricQuote: "一壶漂泊浪迹天涯难入喉，你走之后酒暖回忆思念瘦",
    description: "你像一壶陈年老酒，越品越有味道。你重情重义，对过去的感情念念不忘，但又有一种淡然的洒脱。你把思念化作诗，在时光里慢慢酿成了最动人的故事。",
    mood: "古典思念",
    tags: ["古风", "离别", "思念"],
    profile: [7, 7, 8, 2, 4],
  },
  // 王菲
  {
    id: "hongdou",
    title: "红豆",
    artist: "王菲",
    album: "唱游",
    year: 1998,
    lyricQuote: "还没好好地感受，雪花绽放的气候。我们一起颤抖，会更明白什么是温柔",
    description: "你是一个在感情里很温柔也很勇敢的人。你明白爱情不一定要惊天动地，但那些细腻的瞬间却值得反复回味。你像红豆一样，小小的，却能让人想念很久很久。",
    mood: "温柔缱绻",
    tags: ["温柔", "思念", "经典"],
    profile: [8, 6, 7, 2, 3],
  },
  {
    id: "chuanqi",
    title: "传奇",
    artist: "王菲",
    album: "传奇",
    year: 2003,
    lyricQuote: "只是因为在人群中多看了你一眼，再也没能忘掉你容颜",
    description: "你相信命运和缘分。有些人只需要一个眼神就能刻在心上一辈子，而你就是这样一个容易被打动的人。你的深情不表露于外，却像一条暗涌的河流，永不停息。",
    mood: "深情绵长",
    tags: ["命运", "深情", "一眼万年"],
    profile: [9, 7, 6, 2, 1],
  },
  {
    id: "aimei",
    title: "暧昧",
    artist: "王菲",
    album: "将爱",
    year: 2003,
    lyricQuote: "暧昧让人受尽委屈，找不到相爱的证据",
    description: "你对感情有着异常敏锐的感知力。你能捕捉到关系中最微妙的信号，却常常在确认与犹豫之间反复徘徊。你渴望明确的答案，但又享受那种若即若离的美感。",
    mood: "暧昧迷离",
    tags: ["暧昧", "敏感", "迷离"],
    profile: [8, 6, 6, 2, 3],
  },
  {
    id: "woyuanyi",
    title: "我愿意",
    artist: "王菲",
    album: "迷",
    year: 1994,
    lyricQuote: "思念是一种很玄的东西，如影随形",
    description: "你是一个在爱情面前毫无保留的人。一旦认定，就愿意付出一切。你的爱纯粹得没有条件，像一团不计后果的火焰。你活得真诚，也因此特别动人。",
    mood: "炽热真挚",
    tags: ["奉献", "真挚", "无悔"],
    profile: [10, 4, 5, 4, 4],
  },
  // 孙燕姿
  {
    id: "yujian",
    title: "遇见",
    artist: "孙燕姿",
    album: "The Moment",
    year: 2003,
    lyricQuote: "听见冬天的离开，我在某年某月醒过来",
    description: "你相信每一次遇见都不是偶然。你对人生的每个拐角都抱有期待，相信在某个不经意的时刻，命运会安排那个重要的人出现。你的乐观是发自内心的笃定。",
    mood: "期待温暖",
    tags: ["缘分", "期待", "温暖"],
    profile: [7, 5, 4, 6, 5],
  },
  {
    id: "tianheihe",
    title: "天黑黑",
    artist: "孙燕姿",
    album: "孙燕姿同名专辑",
    year: 2000,
    lyricQuote: "天黑黑欲落雨，天黑黑黑黑",
    description: "你是一个看起来坚强实际上很柔软的人。你经历过一些风雨，但总能在泪水之后重新站起来。你知道世界并不完美，但依然选择温柔以对。你的坚韧藏在那双含泪的眼睛里。",
    mood: "坚韧温柔",
    tags: ["成长", "坚强", "柔软"],
    profile: [5, 6, 7, 5, 3],
  },
  {
    id: "lvguang",
    title: "绿光",
    artist: "孙燕姿",
    album: "风筝",
    year: 2001,
    lyricQuote: "期待着一个幸运，和一个冲击，多么奇妙的际遇",
    description: "你是天生的乐观派，永远相信幸运就在下一个转角。你的能量是感染性的——和你在一起的人都会被你的活力带动。你追逐光芒，同时你自己就是光芒。",
    mood: "活力希望",
    tags: ["希望", "活力", "追逐"],
    profile: [5, 2, 1, 8, 8],
  },
  {
    id: "wobunanguo",
    title: "我不难过",
    artist: "孙燕姿",
    album: "未完成",
    year: 2003,
    lyricQuote: "我不难过，这不算什么，只是为什么眼泪会流",
    description: "你是那种嘴上说没事、心里却翻江倒海的人。你习惯了独自消化情绪，不愿意成为别人的负担。你的坚强里藏着一份让人心疼的倔强，但这份倔强也是你最动人的地方。",
    mood: "倔强温柔",
    tags: ["倔强", "隐忍", "成长"],
    profile: [5, 7, 8, 3, 3],
  },
  {
    id: "kaisidongle",
    title: "开始懂了",
    artist: "孙燕姿",
    album: "风筝",
    year: 2001,
    lyricQuote: "开始懂了，快乐是选择",
    description: "你是一个在经历中不断蜕变的人。每一次的失去和获得都让你更加通透。你开始明白，生活不是非黑即白的，灰色地带里也有属于自己的答案。你在成长中找到了和世界和解的方式。",
    mood: "成长领悟",
    tags: ["成长", "领悟", "释然"],
    profile: [5, 6, 5, 5, 5],
  },
  // 张韶涵
  {
    id: "yinxingdechibang",
    title: "隐形的翅膀",
    artist: "张韶涵",
    album: "潘朵拉",
    year: 2006,
    lyricQuote: "我知道我一直有双隐形的翅膀，带我飞飞过绝望",
    description: "你是一个内心有着强大信念的人。即使生活给你再大的考验，你都相信自己能飞过去。你的力量不来自于外在，而来自于一颗从不认输的心。你是自己的英雄。",
    mood: "坚定希望",
    tags: ["信念", "坚持", "希望"],
    profile: [4, 5, 4, 9, 4],
  },
  {
    id: "ouruola",
    title: "欧若拉",
    artist: "张韶涵",
    album: "欧若拉",
    year: 2004,
    lyricQuote: "爱是一道光，如此美妙，指引我们想要的未来",
    description: "你是那种相信奇迹的人。在别人看来不可能的事情，你却总能找到希望的微光。你的眼里有星星，心里有远方，永远充满了对未知的好奇和向往。你就像极光一样，神秘又美丽。",
    mood: "梦幻希望",
    tags: ["梦幻", "追梦", "美好"],
    profile: [6, 4, 2, 9, 5],
  },
  {
    id: "yishidemehao",
    title: "遗失的美好",
    artist: "张韶涵",
    album: "Over The Rainbow",
    year: 2004,
    lyricQuote: "海底月是天上月，眼前人是心上人",
    description: "你是一个容易被美好事物感动的人。你珍惜生命中每一个值得记住的瞬间，却也常常为那些逝去的美好感到惋惜。你的敏感让你比别人更能感受到这个世界的温度。",
    mood: "怀念感伤",
    tags: ["遗失", "美好", "感伤"],
    profile: [7, 6, 8, 2, 2],
  },
  // 林俊杰
  {
    id: "jiangnan",
    title: "江南",
    artist: "林俊杰",
    album: "第二天堂",
    year: 2004,
    lyricQuote: "风到这里就是粘，粘住过客的思念",
    description: "你有一种水墨画般的气质——温润、含蓄、耐人寻味。你的情感如江南的雨，绵绵不绝却从不滂沱。你喜欢在回忆里漫步，每一个过客都在你心里留下了印记。",
    mood: "柔情似水",
    tags: ["柔情", "回忆", "诗意"],
    profile: [8, 7, 6, 2, 2],
  },
  {
    id: "tashuo",
    title: "她说",
    artist: "林俊杰",
    album: "她说",
    year: 2010,
    lyricQuote: "他说虽然冬天把什么都静止了，但是心中的热并不会消",
    description: "你擅长倾听，能理解别人说不出口的心事。你温暖而体贴，总是那个默默守候的人。你或许不是最耀眼的，但一定是最让人安心的存在。",
    mood: "温暖守候",
    tags: ["倾听", "温暖", "守候"],
    profile: [7, 7, 5, 2, 3],
  },
  {
    id: "xiaojiuwo",
    title: "小酒窝",
    artist: "林俊杰 / 蔡卓妍",
    album: "西界",
    year: 2008,
    lyricQuote: "小酒窝长睫毛是你最美的记号",
    description: "你是一个容易感受到幸福的人。一个微笑、一个眼神就能让你开心一整天。你的快乐很简单也很纯粹，和你在一起的人总会被你的正能量感染。你是人群中最温暖的那缕阳光。",
    mood: "甜蜜明亮",
    tags: ["甜蜜", "可爱", "幸福"],
    profile: [8, 2, 1, 4, 7],
  },
  // 蔡依林
  {
    id: "shuoaini",
    title: "说爱你",
    artist: "蔡依林",
    album: "看我72变",
    year: 2003,
    lyricQuote: "我的世界变得奇妙更难以言喻，还以为是从天而降的梦境",
    description: "你是一个敢爱敢当的人，从不掩饰自己的心意。你相信直接的表达比任何委婉的暗示都来得动人。你的勇敢和直率是你最迷人的地方——世界就需要像你这样敢说出口的人。",
    mood: "勇敢甜蜜",
    tags: ["勇敢", "表白", "甜蜜"],
    profile: [8, 1, 1, 5, 8],
  },
  {
    id: "ribuluo",
    title: "日不落",
    artist: "蔡依林",
    album: "特务J",
    year: 2007,
    lyricQuote: "我要送你日不落的想念，寄出代表爱的明信片",
    description: "你的热情像太阳一样永远不会落下。你活力四射，到哪里都是焦点。你不喜欢拖泥带水，喜欢就大声说出来，不喜欢就潇洒转身。你的人生就是一场不落幕的派对。",
    mood: "热情奔放",
    tags: ["热情", "活力", "洒脱"],
    profile: [6, 1, 1, 5, 10],
  },
  {
    id: "daodai",
    title: "倒带",
    artist: "蔡依林",
    album: "城堡",
    year: 2004,
    lyricQuote: "我受够了等待，你所谓的安排",
    description: "你是一个外表坚强内心柔软的人。你可能会用倔强来掩饰脆弱，用洒脱来掩饰在意。但正是这种矛盾，让你比任何人都更加真实和立体。你值得被人看穿后依然珍惜。",
    mood: "倔强柔软",
    tags: ["倔强", "柔软", "真实"],
    profile: [6, 4, 6, 4, 6],
  },
  // 梁静茹
  {
    id: "yongqi",
    title: "勇气",
    artist: "梁静茹",
    album: "勇气",
    year: 2000,
    lyricQuote: "爱真的需要勇气来面对流言蜚语",
    description: "你是一个在感情里特别勇敢的人。你知道爱一个人需要冒险，但你依然选择全力以赴。你相信，只要足够真诚，就值得被这个世界温柔以待。你的勇气，是最美的情书。",
    mood: "勇敢深情",
    tags: ["勇气", "真爱", "坚定"],
    profile: [9, 3, 4, 6, 5],
  },
  {
    id: "ningxia",
    title: "宁夏",
    artist: "梁静茹",
    album: "美丽人生",
    year: 2004,
    lyricQuote: "知了也睡了，安心的睡了，在我心里面，宁静的夏天",
    description: "你是一个能给别人带来安宁感的人。和你在一起，就像夏夜里听着蝉鸣吹着微风，一切都刚刚好。你不需要华丽的装饰，你本身就是最美好的风景。",
    mood: "宁静美好",
    tags: ["宁静", "夏天", "安心"],
    profile: [6, 7, 2, 2, 6],
  },
  {
    id: "kexibushini",
    title: "可惜不是你",
    artist: "梁静茹",
    album: "丝路",
    year: 2005,
    lyricQuote: "可惜不是你，陪我到最后。感谢那是你，牵过我的手",
    description: "你是一个温柔且懂得感恩的人。你会为错过的缘分感到遗憾，但更多的是感恩那段经历带给你的成长。你相信，每一段感情都有它存在的意义，哪怕结局不完美。",
    mood: "温柔遗憾",
    tags: ["遗憾", "感恩", "释然"],
    profile: [7, 6, 8, 2, 4],
  },
  // 陈奕迅
  {
    id: "shinian",
    title: "十年",
    artist: "陈奕迅",
    album: "黑白灰",
    year: 2003,
    lyricQuote: "十年之前，我不认识你你不属于我。十年之后，我们是朋友还可以问候",
    description: "你是一个对时间有着深刻感悟的人。你明白所有的感情都会被岁月打磨，但不代表它们不曾存在。你活在当下，但心里永远有一个角落留给过去的人。你的洒脱里藏着最深的深情。",
    mood: "释然感伤",
    tags: ["时间", "释然", "深情"],
    profile: [6, 6, 7, 3, 5],
  },
  {
    id: "haojiubujian",
    title: "好久不见",
    artist: "陈奕迅",
    album: "认了吧",
    year: 2007,
    lyricQuote: "我来到你的城市，走过你来时的路",
    description: "你是一个念旧的人。你会独自走过曾经一起走过的路，不为别的，只为再感受一下那时候的心情。你的思念不声不响，却重如千斤。你不说想你，只说好久不见。",
    mood: "深沉思念",
    tags: ["思念", "念旧", "含蓄"],
    profile: [7, 8, 8, 1, 2],
  },
  {
    id: "taotai",
    title: "淘汰",
    artist: "陈奕迅",
    album: "认了吧",
    year: 2007,
    lyricQuote: "只能说我输了，也许是你怕了",
    description: "你是一个在感情里很认真但也很清醒的人。你知道什么时候该放手，即使心里万般不舍。你的理性和感性在不断拉扯，但最终你总会选择那个更难但更对的决定。",
    mood: "清醒忧伤",
    tags: ["放手", "清醒", "成长"],
    profile: [5, 7, 7, 4, 4],
  },
  {
    id: "fukua",
    title: "浮夸",
    artist: "陈奕迅",
    album: "U87",
    year: 2005,
    lyricQuote: "你当我是浮夸吧，夸张只因我很怕",
    description: "你是一个内心世界极其丰富的人，但很少有人真正理解你。你用夸张和幽默来掩饰内心的脆弱和渴望。你需要的不是掌声，而是有人能透过你的浮夸看到你真实的灵魂。",
    mood: "张扬孤独",
    tags: ["孤独", "渴望", "真实"],
    profile: [4, 5, 7, 6, 6],
  },
  // 五月天
  {
    id: "wenrou",
    title: "温柔",
    artist: "五月天",
    album: "爱情万岁",
    year: 2000,
    lyricQuote: "不知道不明了不想要为什么我的心，明明是想靠近却孤单到黎明",
    description: "你有一颗温柔到让人心疼的心。你总是想靠近却不敢靠太近，想说出口却总是沉默。你的温柔不是软弱，而是一种选择——选择把伤留给自己，把好留给别人。",
    mood: "温柔隐忍",
    tags: ["温柔", "暗恋", "隐忍"],
    profile: [7, 7, 6, 2, 2],
  },
  {
    id: "turanhaoxiangni",
    title: "突然好想你",
    artist: "五月天",
    album: "后青春期的诗",
    year: 2008,
    lyricQuote: "突然好想你，你会在哪里，过得快乐或委屈",
    description: "你是一个不善于忘记的人。某个天气、某首歌、某个场景就能瞬间把你拉回过去。你的思念来得毫无征兆却铺天盖地，但你不会打扰对方，只在心里默默问一句：你好吗？",
    mood: "突然思念",
    tags: ["思念", "回忆", "心疼"],
    profile: [7, 6, 9, 2, 2],
  },
  {
    id: "juejiang",
    title: "倔强",
    artist: "五月天",
    album: "时光机",
    year: 2003,
    lyricQuote: "我和我最后的倔强，握紧双手绝对不放",
    description: "你是一个打不倒的人。生活越是把你往下按，你越是要往上冲。你的字典里没有「认输」两个字。你相信只要不放弃，总有一天会证明给全世界看——你可以。",
    mood: "热血倔强",
    tags: ["倔强", "不认输", "热血"],
    profile: [3, 3, 3, 10, 7],
  },
  {
    id: "zhizu",
    title: "知足",
    artist: "五月天",
    album: "知足",
    year: 2005,
    lyricQuote: "怎么去拥有一道彩虹，怎么去拥抱一夏天的风",
    description: "你是一个懂得在平凡中发现美好的人。你不追求轰轰烈烈，只要眼前的小确幸就已足够。你的满足不是因为欲望少，而是因为你真正理解什么是值得珍惜的。",
    mood: "知足温暖",
    tags: ["知足", "珍惜", "平凡"],
    profile: [5, 6, 3, 3, 6],
  },
  // S.H.E
  {
    id: "superstar",
    title: "超级星光",
    artist: "S.H.E",
    album: "Super Star",
    year: 2003,
    lyricQuote: "你是电你是光，你是唯一的神话",
    description: "你天生就有追星般的热情，对喜欢的事物会全力以赴。你不吝啬表达爱意，你的热情能感染周围所有人。你像一颗永不黯淡的星星，照亮每个你经过的角落。",
    mood: "热情崇拜",
    tags: ["热情", "崇拜", "闪耀"],
    profile: [7, 1, 1, 6, 9],
  },
  {
    id: "lianrenweiman",
    title: "恋人未满",
    artist: "S.H.E",
    album: "美丽新世界",
    year: 2002,
    lyricQuote: "如果说你也有些犹豫，怕将来没人和你牵手旅行",
    description: "你是一个在友情和爱情之间反复横跳的人。你珍惜现有的关系，害怕一旦越界就会失去一切。但你心里清楚，有些感情如果不勇敢迈出那一步，就永远停在原地了。",
    mood: "甜蜜纠结",
    tags: ["暧昧", "犹豫", "青春"],
    profile: [8, 5, 4, 3, 4],
  },
  // 张学友
  {
    id: "wenbie",
    title: "吻别",
    artist: "张学友",
    album: "吻别",
    year: 1993,
    lyricQuote: "我和你吻别，在无人的街。让风痴笑我不能拒绝",
    description: "你是一个把爱看得比什么都重的人。分别对你来说不是轻描淡写的事，而是一场需要仪式感的告别。你的深情是90年代港乐才能诠释的那种——浓烈、直接、毫无保留。",
    mood: "深情告别",
    tags: ["告别", "深情", "经典"],
    profile: [9, 5, 7, 2, 3],
  },
  // 刘若英
  {
    id: "houlai",
    title: "后来",
    artist: "刘若英",
    album: "我等你",
    year: 1999,
    lyricQuote: "后来，我总算学会了如何去爱，可惜你早已远去消失在人海",
    description: "你是一个在爱情面前不断成长的人。你可能错过了最好的时机，但你从未停止学习如何去爱。那些遗憾教会了你珍惜，而「后来」这两个字，是你最温柔的叹息。",
    mood: "遗憾成长",
    tags: ["遗憾", "成长", "经典"],
    profile: [7, 6, 9, 3, 2],
  },
  {
    id: "henhaotenian",
    title: "很好",
    artist: "刘若英",
    album: "年华",
    year: 2002,
    lyricQuote: "想得却不可得，你奈人生何",
    description: "你是一个把所有情绪都收拾得很好的人。你不轻易向人示弱，总是用一句「我很好」挡住所有关心。但只有你自己知道，有些夜晚、有些歌、有些名字，依然能让你瞬间破防。",
    mood: "克制坚强",
    tags: ["克制", "坚强", "温柔"],
    profile: [5, 8, 7, 3, 3],
  },
  // 周传雄
  {
    id: "huangrenjia",
    title: "黄昏",
    artist: "周传雄",
    album: "Transfer",
    year: 2000,
    lyricQuote: "过完整个夏天，忧伤并没有好一些",
    description: "你是一个容易陷入情绪里的人，但这并不是缺点。你对世界的感知比别人更深、更细腻。你在黄昏的光线里最美，那种带着一点忧伤的温柔，让人想靠近又怕打扰。",
    mood: "忧伤温柔",
    tags: ["黄昏", "忧伤", "细腻"],
    profile: [6, 7, 9, 1, 2],
  },
  // 任贤齐
  {
    id: "shangxinhtplqw",
    title: "伤心太平洋",
    artist: "任贤齐",
    album: "爱像太平洋",
    year: 1998,
    lyricQuote: "一个人在海边看着潮起潮落",
    description: "你看似洒脱，实则深情。你喜欢一个人面对大海发呆，把心事交给风和海浪。你的伤心不会轻易示人，你更习惯在广阔的天地间独自消化。你的格局，和你的温柔一样大。",
    mood: "辽阔深情",
    tags: ["辽阔", "独处", "深情"],
    profile: [6, 7, 6, 3, 5],
  },
  // 光良
  {
    id: "tonghua",
    title: "童话",
    artist: "光良",
    album: "童话",
    year: 2005,
    lyricQuote: "你要相信，相信我们会像童话故事里，幸福和快乐是结局",
    description: "你是一个至今仍然相信童话的人。不管经历了多少现实的冲击，你心里始终有一个柔软的角落，留给那些关于美好结局的幻想。你的纯真是最珍贵的宝藏。",
    mood: "纯真温暖",
    tags: ["童话", "相信", "纯真"],
    profile: [9, 4, 4, 5, 4],
  },
  // 张信哲
  {
    id: "airu",
    title: "爱如潮水",
    artist: "张信哲",
    album: "心事",
    year: 1993,
    lyricQuote: "我的爱如潮水，爱如潮水将我向你推",
    description: "你的爱是不可抗拒的自然力量——如潮水般汹涌，无法阻挡。你爱一个人的时候毫无保留，把全部的自己都交出去。你的深情是骨子里的，改不了，也不想改。",
    mood: "汹涌深情",
    tags: ["深情", "汹涌", "经典"],
    profile: [10, 5, 5, 2, 2],
  },
  // 张惠妹
  {
    id: "tinghai",
    title: "听海",
    artist: "张惠妹",
    album: "Bad Boy",
    year: 1997,
    lyricQuote: "听海哭的声音，叹息着谁又被伤了心",
    description: "你的情感世界像大海一样辽阔。你能听到别人听不到的声音，感受到别人感受不到的痛苦。你的共情能力超强，但这也意味着你要承受更多。你是一个为了爱可以把眼泪交给大海的人。",
    mood: "辽阔感伤",
    tags: ["大海", "感伤", "共情"],
    profile: [7, 6, 9, 1, 2],
  },
  // 莫文蔚
  {
    id: "shengsifeishi",
    title: "盛夏的果实",
    artist: "莫文蔚",
    album: "就是莫文蔚",
    year: 2001,
    lyricQuote: "也许放弃才能靠近你，不再见你你才会把我记起",
    description: "你理解一种很复杂的情感——有时候放手比拥有更需要勇气。你懂得用距离来成全爱情，在退后中保全了最后的体面。你的成熟和通透，让你在感情里始终保有一份清醒的美。",
    mood: "成熟释然",
    tags: ["放手", "成熟", "释然"],
    profile: [6, 7, 6, 3, 5],
  },
  // 萧亚轩
  {
    id: "zuiximideren",
    title: "最熟悉的陌生人",
    artist: "萧亚轩",
    album: "红蔷薇",
    year: 1999,
    lyricQuote: "我们变成了世上最熟悉的陌生人",
    description: "你经历过那种从亲密无间到形同陌路的转变。你不恨任何人，只是觉得命运的安排有时候太残忍了。但你依然选择记住美好的部分，让那些曾经的温暖成为前行的力量。",
    mood: "感伤释然",
    tags: ["物是人非", "释然", "成长"],
    profile: [6, 6, 8, 3, 4],
  },
  // 许嵩
  {
    id: "qingmingyu",
    title: "清明雨上",
    artist: "许嵩",
    album: "寻雾启示",
    year: 2009,
    lyricQuote: "窗透初晓，日照西桥云自摇",
    description: "你是一个有着古典文人气质的人。你用诗意的眼光看待世界，在现代生活里保留了一份古典的浪漫。你的文字和想法总是带着水墨画般的韵味，独特而迷人。",
    mood: "古典诗意",
    tags: ["古风", "诗意", "独特"],
    profile: [7, 9, 5, 3, 2],
  },
  // 飞儿乐团
  {
    id: "womendeai",
    title: "我们的爱",
    artist: "飞儿乐团",
    album: "飞儿乐团同名专辑",
    year: 2004,
    lyricQuote: "我们的爱过了就不再回来",
    description: "你是一个活在当下的人。你明白所有的美好都有期限，所以更加珍惜此刻拥有的一切。你不执着于过去，也不焦虑未来，你只想好好把握住手中的温暖。",
    mood: "珍惜当下",
    tags: ["珍惜", "当下", "青春"],
    profile: [6, 4, 4, 5, 6],
  },
  // 杨丞琳
  {
    id: "yuguangyouwei",
    title: "雨爱",
    artist: "杨丞琳",
    album: "雨爱",
    year: 2010,
    lyricQuote: "我试着恨你，却想起你的笑容",
    description: "你是一个心软的人。即使被伤害了，你也没办法真正恨一个人。你的善良有时候让你吃亏，但这也是你最珍贵的品质。你相信以德报怨，因为你的爱比恨要多得多。",
    mood: "心软温柔",
    tags: ["心软", "温柔", "善良"],
    profile: [7, 5, 6, 2, 3],
  },
  // 潘玮柏
  {
    id: "bushaguo",
    title: "不得不爱",
    artist: "潘玮柏 / 弦子",
    album: "Wu Ha",
    year: 2005,
    lyricQuote: "不得不爱，这是不是命运的安排",
    description: "你是一个相信命中注定的人。你觉得有些感情就是无法抗拒的，不管你怎么逃避最终都会回到那个人身边。你的洒脱里藏着宿命论的浪漫，这让你的爱情故事特别有戏剧性。",
    mood: "命定浪漫",
    tags: ["命运", "浪漫", "洒脱"],
    profile: [8, 3, 3, 4, 7],
  },
  // 王力宏
  {
    id: "weiyideweiyi",
    title: "唯一",
    artist: "王力宏",
    album: "唯一",
    year: 2001,
    lyricQuote: "你是我的唯一",
    description: "你是一个在感情里非常专一的人。一旦认定了一个人，就会全心全意不留退路。你的爱简单直接，没有什么弯弯绕绕，「你是我的唯一」就是你最真实的心声。",
    mood: "专一坚定",
    tags: ["专一", "坚定", "真挚"],
    profile: [8, 4, 3, 4, 4],
  },
  // 范玮琪
  {
    id: "yihaohaode",
    title: "一个像夏天一个像秋天",
    artist: "范玮琪",
    album: "真善美",
    year: 2005,
    lyricQuote: "一个像夏天一个像秋天，却总能把冬天变成了春天",
    description: "你是一个特别珍惜友情的人。你相信有一种关系不是爱情但比爱情更长久。你和你的好朋友像夏天和秋天，性格不同却完美互补。你最幸福的时刻就是和好友在一起的每一天。",
    mood: "友情温暖",
    tags: ["友情", "珍惜", "温暖"],
    profile: [6, 3, 2, 4, 7],
  },
  // 戴佩妮
  {
    id: "nihaobuhaox",
    title: "你要的爱",
    artist: "戴佩妮",
    album: "怎样",
    year: 2001,
    lyricQuote: "你要的爱不只是依赖",
    description: "你是一个独立但渴望爱的人。你明白真正的爱不是依赖和束缚，而是两个完整的人选择在一起。你对爱有自己的标准，宁缺毋滥。你等的不是一个人来拯救你，而是一个人来和你并肩。",
    mood: "独立清醒",
    tags: ["独立", "清醒", "标准"],
    profile: [5, 6, 3, 6, 6],
  },
  // 陶喆
  {
    id: "putongpengyou",
    title: "普通朋友",
    artist: "陶喆",
    album: "I'm OK",
    year: 1999,
    lyricQuote: "我不想做你的普通朋友",
    description: "你是一个不甘心的人。你不喜欢暧昧不清的关系，要么全部要么没有。你有勇气打破友情的界限，也有承受失败后果的担当。你的直率在这个含蓄的时代显得特别珍贵。",
    mood: "不甘暧昧",
    tags: ["勇敢", "直率", "不甘"],
    profile: [7, 3, 4, 6, 6],
  },
]

export function calculateResult(answers: Record<number, number>): string {
  // 计算用户的性格画像
  const userProfile: [number, number, number, number, number] = [0, 0, 0, 0, 0]
  let count = 0

  for (const [questionIdStr, optionIndex] of Object.entries(answers)) {
    const questionId = Number.parseInt(questionIdStr)
    const question = questions.find((q) => q.id === questionId)
    if (question) {
      const option = question.options[optionIndex]
      if (option) {
        for (let i = 0; i < 5; i++) {
          userProfile[i] += option.scores[i]
        }
        count++
      }
    }
  }

  // 取平均值
  if (count > 0) {
    for (let i = 0; i < 5; i++) {
      userProfile[i] = userProfile[i] / count
    }
  }

  // 用欧几里得距离找最匹配的歌
  let bestSong = songs[0]
  let bestDistance = Number.MAX_VALUE

  for (const song of songs) {
    let distance = 0
    for (let i = 0; i < 5; i++) {
      distance += (userProfile[i] - song.profile[i]) ** 2
    }
    distance = Math.sqrt(distance)

    if (distance < bestDistance) {
      bestDistance = distance
      bestSong = song
    }
  }

  return bestSong.id
}
