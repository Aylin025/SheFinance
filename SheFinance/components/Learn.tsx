import React from 'react';
import { BookOpen, Target, LineChart, ShieldAlert } from 'lucide-react';

export const Learn: React.FC = () => {
  const resources = [
    {
      id: 'khan',
      name: 'Khan Academy',
      focus: 'Personal Finance + Investing',
      why: 'Clear, modular lessons you can link alongside trades',
      how: [
        'Embed or link specific videos (e.g., "stocks vs bonds") next to trading actions',
        'Create "Learn before you trade" prompts',
      ],
      feature: 'Beginner-friendly explanations that match user actions',
      bg: 'bg-[#FF8299]/10',
      iconBg: 'bg-[#FF8299]/20',
      iconText: 'text-[#FF8299]',
      borderHover: 'hover:border-[#FF8299]/50 hover:shadow-[#FF8299]/20',
      icon: BookOpen,
      url: 'https://www.khanacademy.org/college-careers-more/personal-finance',
    },
    {
      id: 'investopedia',
      name: 'Investopedia',
      focus: 'Articles + Simulator Content',
      why: 'Massive library of definitions and tutorials',
      how: [
        'Add tooltips: hover over "P/E ratio" → show definition',
        'Link articles directly from stock pages',
      ],
      feature: 'Simulator content aligns perfectly with practice trading',
      bg: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      borderHover: 'hover:border-yellow-400 hover:shadow-yellow-200',
      icon: Target,
      url: 'https://www.investopedia.com/',
    },
    {
      id: 'tradingview',
      name: 'TradingView',
      focus: 'Charts + Community Ideas',
      why: 'Combines education with real market visuals',
      how: [
        'Embed charts with indicators',
        'Show community trade ideas alongside your paper trading interface',
      ],
      feature: 'Helps users learn technical analysis interactively',
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      borderHover: 'hover:border-emerald-400 hover:shadow-emerald-200',
      icon: LineChart,
      url: 'https://www.tradingview.com/',
    },
    {
      id: 'morningstar',
      name: 'Morningstar',
      focus: 'Fundamentals + Analysis',
      why: 'Teaches why investments are good or bad',
      how: [
        'Add simplified analyst ratings or summaries',
        'Show "learning cards" explaining valuation, risk, etc.',
      ],
      feature: 'Strong focus on long-term investing principles',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      borderHover: 'hover:border-purple-400 hover:shadow-purple-200',
      icon: ShieldAlert,
      url: 'https://www.morningstar.com/',
    },
  ];

  const women = [
    {
      name: 'Jane Fraser',
      role: 'CEO of Citigroup',
      img: '/images/jane_fraser.jpg',
      info:
        'As the first woman to lead a major Wall Street bank, Jane Fraser is redefining leadership in finance. She inspires millions by breaking barriers, championing innovation, and promoting diversity across the global banking industry.',
    },
    {
      name: 'Abigail Johnson',
      role: 'CEO of Fidelity Investments',
      img: '/images/abigail_johnson.jpeg',
      info:
        'Abigail Johnson leads one of the world’s largest investment firms, guiding Fidelity with vision and innovation. Her leadership has expanded opportunities in wealth management while emphasizing technology and inclusion.',
    },
    {
      name: 'Janet Yellen',
      role: 'US Treasury Secretary',
      img: '/images/janet_yellen.jpg',
      info:
        'Janet Yellen made history as the first woman to chair the Federal Reserve and now serves as Treasury Secretary. Her expertise, steady guidance, and commitment to economic equity have shaped global financial policy.',
    },
    {
      name: 'Muriel Siebert',
      role: 'Wall Street Pioneer',
      img: '/images/muriel_siebert.png',
      info:
        'Known as the first woman to own a seat on the New York Stock Exchange, Muriel Siebert shattered gender barriers in finance. She championed transparency, education, and empowerment for future generations of investors.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Educational Resources Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Educational Resources
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover the best platforms to build your financial literacy and become confident in your investing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((res) => {
            const Icon = res.icon;
            return (
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                key={res.id}
                className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${res.borderHover}`}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${res.iconBg}`}>
                      <Icon className={`w-6 h-6 ${res.iconText}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">
                        {res.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        {res.focus}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Why it works</p>
                      <p className="text-slate-700 text-sm">{res.why}</p>
                    </div>
                    
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">How to use it</p>
                      <ul className="list-disc list-outside text-slate-700 text-sm space-y-1 ml-4">
                        {res.how.map((point, idx) => (
                          <li key={idx} className="leading-snug">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${res.bg} mt-auto border border-white`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500/70 mb-1">Best Feature</p>
                  <p className={`text-sm font-bold ${res.iconText}`}>{res.feature}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Inspirational Women Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Inspirational Women in Finance
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Celebrating female leaders who shaped the world of finance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {women.map((woman, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 mb-4 rounded-full overflow-hidden">
                <img
                  src={woman.img}
                  alt={woman.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {woman.name}
              </h3>
              <p className="text-sm text-slate-500 mb-4">{woman.role}</p>
              <p className="text-slate-600">{woman.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
