import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from './Tabs';
import { cn } from '~/utils';
import Recommendations from './Recommendations';
import Leaderboard from './Leaderboard';

export default function Landing() {
  const [tabsValue, setTabsValue] = useState<string>("leaderboard");

  const cardStyle =
    'transition-colors shadow-md rounded-md min-w-[75px] font-normal bg-white border-black/10 hover:border-black/10 focus:border-black/10 dark:border-black/10 dark:hover:border-black/10 dark:focus:border-black/10 border dark:bg-gray-700 text-black dark:text-white';
  const defaultClasses =
    'p-2 rounded-md min-w-[75px] font-normal bg-white/[.60] dark:bg-gray-700 text-black text-xs';
  const defaultSelected = cn(
    defaultClasses,
    'font-medium data-[state=active]:text-white text-xs text-white'
  );
  const selectedTab = (val: string) => val + '-tab ' + defaultSelected;

  return (
    <>
      <div
        className={
          'flex w-full flex-wrap items-center justify-center gap-2'
        }
      >
        <Tabs 
          value={tabsValue}
          className={
            cardStyle +
            ' z-50 flex h-[40px] flex-none items-center justify-center px-0 hover:bg-slate-50 dark:hover:bg-gray-600'
          }
          onValueChange={(value) => setTabsValue(value)}
        >
          <TabsList className="bg-white/[.60] dark:bg-gray-700">
            <TabsTrigger
              value='leaderboard'
              className={`${tabsValue === 'leaderboard' ? selectedTab('creative') : defaultClasses}`}
            >
              {'排行榜'}
            </TabsTrigger>
            <TabsTrigger
              value='recommendations'
              className={`${tabsValue === 'recommendations' ? selectedTab('fast') : defaultClasses}`}
            >
              {'对话推荐'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex h-full flex-col items-center overflow-y-auto pt-0 text-sm dark:bg-gray-800">
        <div className="w-full px-6 text-gray-800 dark:text-gray-100 md:flex md:max-w-2xl md:flex-col lg:max-w-3xl">
          { tabsValue === 'leaderboard' ? <Leaderboard /> : <Recommendations /> }
        </div>
      </div>
    </>
  );
}
