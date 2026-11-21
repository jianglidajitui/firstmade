import headphonesImg from '@/assets/products/headphones.png'
import cableImg from '@/assets/products/cable.png'
import chargerImg from '@/assets/products/charger.png'
import earbudsImg from '@/assets/products/earbuds.png'
import magneticImg from '@/assets/products/magnetic-charger.svg'
import desktopKitImg from '@/assets/products/desktop-kit.svg'
import openEarImg from '@/assets/products/open-ear.svg'
import endedHubImg from '@/assets/products/ended-hub.svg'

const day = 24 * 60 * 60 * 1000
const now = Date.now()

export const STATUS_LABELS = {
  crowdfunding: '众筹中',
  funded: '待生产',
  producing: '生产中',
  in_stock: '现货',
  ended: '已结束',
}

export const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'audio', label: '耳机音频' },
  { id: 'cable', label: '线材配件' },
  { id: 'charging', label: '充电设备' },
]

export const PRESET_IMAGES = [
  { id: 'headphones', src: headphonesImg, label: '头戴式耳机' },
  { id: 'earbuds', src: earbudsImg, label: '入耳式耳机' },
  { id: 'open-ear', src: openEarImg, label: '开放式耳机' },
  { id: 'cable', src: cableImg, label: '编织数据线' },
  { id: 'charger', src: chargerImg, label: '氮化镓充电器' },
  { id: 'magnetic', src: magneticImg, label: '磁吸充电座' },
  { id: 'desktop-kit', src: desktopKitImg, label: '桌面快充套装' },
  { id: 'hub', src: endedHubImg, label: '扩展坞' },
]

function timelineFor(status, createdAt) {
  const base = [
    {
      id: 'launch',
      title: '新品发布',
      desc: '工厂提交产品方案，开启 1 元意向预定。',
      at: createdAt,
      done: true,
    },
  ]

  if (status === 'crowdfunding') {
    base.push({
      id: 'support',
      title: '收集支持',
      desc: '达到目标人数后进入待生产。',
      at: null,
      done: false,
    })
  }

  if (['funded', 'producing', 'in_stock'].includes(status)) {
    base.push({
      id: 'funded',
      title: '达到目标人数',
      desc: '项目达标，等待工厂确认排产。',
      at: createdAt + 20 * day,
      done: true,
    })
  }

  if (['producing', 'in_stock'].includes(status)) {
    base.push({
      id: 'producing',
      title: '启动生产',
      desc: '工厂进入打样、组装与质检流程。',
      at: createdAt + 25 * day,
      done: true,
    })
  }

  if (status === 'in_stock') {
    base.push({
      id: 'stock',
      title: '现货上架',
      desc: '产品完成量产并开放正式购买。',
      at: createdAt + 55 * day,
      done: true,
    })
  }

  if (status === 'ended') {
    base.push({
      id: 'ended',
      title: '众筹结束',
      desc: '未达目标人数，项目已结束。',
      at: createdAt + 30 * day,
      done: true,
    })
  }

  return base
}

export function createInitialProducts() {
  return [
    {
      id: 'fm-hp-001',
      slug: 'transparent-headphones',
      name: '透明头戴式耳机 HP-01',
      category: 'audio',
      tagline: '透明腔体可见内部声学结构，轻量化镁铝框架。',
      description:
        'HP-01 面向长时间聆听场景，采用透明聚碳酸酯耳罩外壳，露出磁路与阻尼结构；头梁使用镁铝合金，耳垫为蛋白皮包裹高回弹海绵。支持有线 / 无线双模式，适合桌面创作与通勤切换。',
      images: [headphonesImg, headphonesImg],
      features: [
        {
          title: '可见声学腔体',
          text: '透明外壳保留内部走线与驱动单元轮廓，方便理解声音形成路径。',
          image: headphonesImg,
        },
        {
          title: '双铰链折叠',
          text: '耳罩支持平面折叠，收纳厚度降低约 40%，适合放入背包侧仓。',
          image: headphonesImg,
        },
        {
          title: '低阻抗驱动',
          text: '40mm 钕磁驱动，手机直推也能保持清晰中高频。',
          image: headphonesImg,
        },
      ],
      specs: [
        { label: '驱动单元', value: '40mm 钕磁动圈' },
        { label: '频率响应', value: '20Hz – 20kHz' },
        { label: '续航', value: '约 35 小时' },
        { label: '接口', value: 'USB-C / 3.5mm' },
        { label: '重量', value: '约 268g' },
        { label: '颜色', value: '白银 / 透明' },
      ],
      factory: {
        name: '甬声精密声学',
        region: '浙江宁波',
        about: '专注消费音频结构件与整机组装，具备小批量柔性产线。',
      },
      reservationFee: 1,
      estimatedPrice: 899,
      salePrice: null,
      supporters: 499,
      targetSupporters: 500,
      status: 'crowdfunding',
      createdAt: now - 18 * day,
      deadline: now + 12 * day,
      productionDays: 45,
      stock: 0,
      variants: [{ id: 'white', label: '白银透明', available: true }],
      faqs: [
        {
          q: '1 元预定后还需要补尾款吗？',
          a: '本站为演示原型，不承诺真实补款或退款规则。正式产品上架后需另行按售价购买。',
        },
        {
          q: '预计什么时候能买到现货？',
          a: '达标后工厂会进入待生产，再由工作台推进生产与上架。演示中可在工厂工作台模拟推进。',
        },
      ],
      timeline: timelineFor('crowdfunding', now - 18 * day),
      darkStory: true,
    },
    {
      id: 'fm-cb-002',
      slug: 'braided-cable',
      name: '编织快充数据线 C-60',
      category: 'cable',
      tagline: '高密度尼龙编织，液态硅胶内护层，弯折寿命 10000+ 次。',
      description:
        'C-60 采用双色尼龙编织外套与液态硅胶内护层，USB-C 两端支持最高 60W 功率协商。接头壳体为哑光白工程塑料，金属屏蔽层经拉丝处理，适合日常充电与数据传输。',
      images: [cableImg, cableImg],
      features: [
        {
          title: '高密度编织',
          text: '外层尼龙编织抗刮耐磨，手感偏干爽，不易打结。',
          image: cableImg,
        },
        {
          title: '60W 功率协商',
          text: '内置 E-Marker 芯片，笔记本与手机均可按协议协商功率。',
          image: cableImg,
        },
        {
          title: '强化应力区',
          text: '接头根部加厚应变释放，减少反复弯折导致的断芯。',
          image: cableImg,
        },
      ],
      specs: [
        { label: '长度', value: '1.2m' },
        { label: '最大功率', value: '60W' },
        { label: '数据速率', value: 'USB 2.0' },
        { label: '接口', value: 'USB-C to USB-C' },
        { label: '材质', value: '尼龙编织 + 硅胶' },
        { label: '颜色', value: '珍珠白' },
      ],
      factory: {
        name: '辰线智造',
        region: '广东东莞',
        about: '线材与连接器代工厂，擅长消费电子配件小批量试产。',
      },
      reservationFee: 1,
      estimatedPrice: 79,
      salePrice: null,
      supporters: 768,
      targetSupporters: 1000,
      status: 'crowdfunding',
      createdAt: now - 25 * day,
      deadline: now + 20 * day,
      productionDays: 30,
      stock: 0,
      variants: [
        { id: '1.2', label: '1.2 米', available: true },
        { id: '2.0', label: '2.0 米', available: true },
      ],
      faqs: [
        {
          q: '是否支持视频输出？',
          a: '当前版本为充电与数据传输规格，不含 DisplayPort Alt Mode。',
        },
      ],
      timeline: timelineFor('crowdfunding', now - 25 * day),
    },
    {
      id: 'fm-mg-003',
      slug: 'magnetic-dock',
      name: '磁吸无线充电座 M-Dock',
      category: 'charging',
      tagline: '15W 磁吸快充，铝合金底座可调倾角，夜间指示灯可关闭。',
      description:
        'M-Dock 将磁吸线圈嵌入可调节铝合金托架，手机吸附后保持 15°–60° 可视角度。底座内置散热铝板，支持夜间熄灯模式，适合床头与办公桌面。',
      images: [magneticImg, magneticImg],
      features: [
        {
          title: '磁吸对位',
          text: '环形磁铁阵列引导线圈居中，减少偏移导致的发热。',
          image: magneticImg,
        },
        {
          title: '倾角调节',
          text: '阻尼转轴支持单手调节角度，观看视频时更稳。',
          image: magneticImg,
        },
      ],
      specs: [
        { label: '输出功率', value: '最高 15W' },
        { label: '输入', value: 'USB-C 9V/2A' },
        { label: '材质', value: '铝合金 + PC' },
        { label: '兼容', value: '磁吸手机系列' },
      ],
      factory: {
        name: '磁能工坊',
        region: '江苏苏州',
        about: '无线充电模组与结构件工厂，具备磁铁阵列校准能力。',
      },
      reservationFee: 1,
      estimatedPrice: 249,
      salePrice: null,
      supporters: 500,
      targetSupporters: 500,
      status: 'funded',
      createdAt: now - 40 * day,
      deadline: now - 2 * day,
      productionDays: 35,
      stock: 0,
      variants: [{ id: 'silver', label: '银色', available: true }],
      faqs: [
        {
          q: '什么时候开始生产？',
          a: '项目已达标，工厂可在工作台点击「模拟开始生产」。',
        },
      ],
      timeline: timelineFor('funded', now - 40 * day),
    },
    {
      id: 'fm-oe-004',
      slug: 'open-ear-sport',
      name: '开放式运动耳机 OE-2',
      category: 'audio',
      tagline: '气传导开放式佩戴，IP55 防护，跑步时仍能听见环境声。',
      description:
        'OE-2 采用开放式耳挂结构，驱动单元贴合耳廓外侧，不堵塞耳道。双麦通话降噪，续航约 8 小时，适合户外跑步与骑行。当前处于生产阶段，组装与防水测试进行中。',
      images: [earbudsImg, openEarImg],
      features: [
        {
          title: '开放式结构',
          text: '不入耳设计降低长时间佩戴压迫感，并保留环境感知。',
          image: earbudsImg,
        },
        {
          title: '运动防脱落',
          text: '钛丝耳挂可微调弧度，剧烈运动时保持稳定。',
          image: openEarImg,
        },
      ],
      specs: [
        { label: '续航', value: '耳机 8h / 充电盒 28h' },
        { label: '防护', value: 'IP55' },
        { label: '蓝牙', value: '5.3' },
        { label: '重量', value: '单耳约 8.6g' },
      ],
      factory: {
        name: '甬声精密声学',
        region: '浙江宁波',
        about: '专注消费音频结构件与整机组装，具备小批量柔性产线。',
      },
      reservationFee: 1,
      estimatedPrice: 599,
      salePrice: null,
      supporters: 1000,
      targetSupporters: 1000,
      status: 'producing',
      createdAt: now - 60 * day,
      deadline: now - 15 * day,
      productionDays: 40,
      stock: 0,
      variants: [{ id: 'white', label: '白色', available: true }],
      faqs: [
        {
          q: '生产进度如何查看？',
          a: '可在本页时间线查看，或由工厂在工作台推进至现货。',
        },
      ],
      timeline: timelineFor('producing', now - 60 * day),
    },
    {
      id: 'fm-gn-005',
      slug: 'gan-65w',
      name: '65W 氮化镓充电器 G65',
      category: 'charging',
      tagline: '双 C + A 三口智能分配，体积约传统充电器一半。',
      description:
        'G65 采用氮化镓功率器件，双 USB-C 与单 USB-A 可智能功率分配。单口最高 65W，满足笔记本与手机同时补能。壳体为哑光白 PC，欧规插脚，已完成量产上架。',
      images: [chargerImg, chargerImg],
      features: [
        {
          title: '三口同充',
          text: '双 C + A 端口，插上设备后自动协商功率分配。',
          image: chargerImg,
        },
        {
          title: '紧凑机身',
          text: '氮化镓方案降低发热与体积，适合差旅收纳。',
          image: chargerImg,
        },
      ],
      specs: [
        { label: '总额定功率', value: '65W' },
        { label: '接口', value: 'USB-C ×2 + USB-A ×1' },
        { label: '尺寸', value: '约 72 × 36 × 32mm' },
        { label: '插脚', value: '欧规两脚' },
      ],
      factory: {
        name: '源力电源',
        region: '广东深圳',
        about: '消费级电源适配器工厂，具备 GaN 方案量产经验。',
      },
      reservationFee: 1,
      estimatedPrice: 199,
      salePrice: 189,
      supporters: 1000,
      targetSupporters: 1000,
      status: 'in_stock',
      createdAt: now - 90 * day,
      deadline: now - 50 * day,
      productionDays: 30,
      stock: 128,
      variants: [
        { id: 'eu', label: '欧规白', available: true },
        { id: 'cn', label: '国标白', available: true },
      ],
      faqs: [
        {
          q: '能否给笔记本充电？',
          a: '单口最高 65W，可覆盖多数轻薄本；请确认设备支持 USB-C 充电。',
        },
      ],
      timeline: timelineFor('in_stock', now - 90 * day),
    },
    {
      id: 'fm-dk-006',
      slug: 'desktop-fast-kit',
      name: '桌面快充套装 Desk Kit',
      category: 'charging',
      tagline: '充电器 + 编织线 + 磁吸底座，桌面补能一次配齐。',
      description:
        'Desk Kit 将 65W 充电器、1.2m 编织线与磁吸底座组合包装，面向家庭办公桌面场景。统一哑光白外观，减少桌面线材杂乱。',
      images: [desktopKitImg, chargerImg, cableImg],
      features: [
        {
          title: '组合收纳',
          text: '统一配色与包装分区，桌面只保留必要接口。',
          image: desktopKitImg,
        },
        {
          title: '功率互补',
          text: '有线 65W 与无线 15W 可按场景切换。',
          image: chargerImg,
        },
      ],
      specs: [
        { label: '套装内容', value: 'G65 + C-60 + M-Dock' },
        { label: '有线功率', value: '65W' },
        { label: '无线功率', value: '15W' },
        { label: '线长', value: '1.2m' },
      ],
      factory: {
        name: '源力电源',
        region: '广东深圳',
        about: '消费级电源适配器工厂，具备 GaN 方案量产经验。',
      },
      reservationFee: 1,
      estimatedPrice: 399,
      salePrice: 369,
      supporters: 800,
      targetSupporters: 800,
      status: 'in_stock',
      createdAt: now - 100 * day,
      deadline: now - 60 * day,
      productionDays: 35,
      stock: 64,
      variants: [{ id: 'white', label: '珍珠白套装', available: true }],
      faqs: [
        {
          q: '能否单买其中一件？',
          a: '演示站中套装为独立 SKU；单品可在发现页分别查看。',
        },
      ],
      timeline: timelineFor('in_stock', now - 100 * day),
    },
    {
      id: 'fm-hb-007',
      slug: 'usb-c-hub-lite',
      name: '轻薄扩展坞 Hub Lite',
      category: 'cable',
      tagline: '四口扩展，铝合金一体壳，适合轻办公临时扩展。',
      description:
        'Hub Lite 提供 HDMI、USB-A、USB-C 数据与 PD 供电透传。因众筹期内未达目标人数，项目已结束，仅保留展示。',
      images: [endedHubImg],
      features: [
        {
          title: '一体铝壳',
          text: 'CNC 铝合金壳体有助于散热与结构强度。',
          image: endedHubImg,
        },
      ],
      specs: [
        { label: '接口', value: 'HDMI / USB-A / USB-C / PD' },
        { label: 'HDMI', value: '最高 4K@30Hz' },
        { label: '材质', value: '铝合金' },
      ],
      factory: {
        name: '辰线智造',
        region: '广东东莞',
        about: '线材与连接器代工厂，擅长消费电子配件小批量试产。',
      },
      reservationFee: 1,
      estimatedPrice: 229,
      salePrice: null,
      supporters: 186,
      targetSupporters: 500,
      status: 'ended',
      createdAt: now - 70 * day,
      deadline: now - 10 * day,
      productionDays: 40,
      stock: 0,
      variants: [{ id: 'space', label: '深空灰', available: false }],
      faqs: [
        {
          q: '结束后还能预定吗？',
          a: '不能。未达标项目已停止接受意向预定。',
        },
      ],
      timeline: timelineFor('ended', now - 70 * day),
    },
  ]
}
