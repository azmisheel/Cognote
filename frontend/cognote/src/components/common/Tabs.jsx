import React from "react";

const Tabs = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="w-full">
      <div className="relative border-b-2 border-slate-100">
        <nav className="flex-gap-2">
          {tabs.map((t) => (
            <button
              key={t.name}
              onClick={() => setActiveTab(t.name)}
              className={`relative pb-4 px-6 text-sm font-semibold transition-all duration-200 
                        ${activeTab === t.name ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              <span className="relative z-10">{t.label}</span>
              {activeTab === t.name && (
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-r from-emerald-500 to-teal-500 rounded full shadow-lg shadow-emerald-500/25" />
              )}
              {activeTab === t.name && (
                <div className="absolute inset-0 bg-linear-to-b from-emerald-50/50 to-transparent rounded-t-xl -z-10" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-6">
        {tabs.map((t) => {
          if (t.name === activeTab) {
            return (
              <div className="animate-in fade-in duration-300" key={t.name}>
                {t.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
