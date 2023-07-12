import { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Label } from '~/components/ui/Label';
import SelectDropDown from '../../../ui/SelectDropDown';
import { cn } from '~/utils/';
import * as Switch from '@radix-ui/react-switch';

/*
作者职位、写作水平、字数、主题、布局、风格、引文、读者
https://www.griproom.com/fun/how-to-use-chat-gpt-to-write-an-essay
https://www.griproom.com/fun/how-to-write-better-prompts-for-chat-gpt
*/
function getParagraphFields({ paragraphCount, paraTopic, setParaTopic }) {
  const numOfParagraph = Number(paragraphCount);
  const defaultTextProps =
  	'rounded-md border border-gray-200 focus:border-slate-400 focus:bg-gray-50 bg-transparent text-sm shadow-[0_0_10px_rgba(0,0,0,0.05)] outline-none placeholder:text-gray-400 focus:outline-none focus:ring-gray-400 focus:ring-opacity-20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:bg-gray-700 focus:dark:bg-gray-600 dark:text-gray-50 dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] dark:focus:border-gray-400 dark:focus:outline-none dark:focus:ring-0 dark:focus:ring-gray-400 dark:focus:ring-offset-0';
  const rows = new Array(numOfParagraph);

  for (let i = 0; i < numOfParagraph; i++) {
    rows.push(<input className={cn(
      defaultTextProps,
      'flex max-h-[300px] h-[30px] w-full resize-none px-3 py-2'
    )}
    value={paraTopic[i]}
    placeholder={`段落${i + 1}`}
    title={`段落${i + 1}`}
    onChange={
      (e) => {
        const newTopics = structuredClone(paraTopic);
        newTopics[i] = e.target.value || '';
        setParaTopic(newTopics)
      }
    }
    />
    )
  }

  return (
    <div className='flex flex-col gap-1 overflow-auto h-[142px]'>
      {rows}
    </div>
  );
}

function WritingAssistant({ setOption }) {
  // Essay basic bundle
  const [level, setLevel] = useState<string>('学士');
  const [wordCount, setWordCount] = useState<string>('500');
  const [topic, setTopic] = useState<string>('');
  const [paragraphCount, setParagraphCount] = useState<string>('3');
  const [easyMode, setEasyMode] = useState<boolean>(true);
  const [paraTopic, setParaTopic] = useState<string[]>(new Array(Number(paragraphCount)).fill(''));

  const paragraphFields = getParagraphFields({ paragraphCount, paraTopic, setParaTopic });

  const defaultTextProps =
  	'rounded-md border border-gray-200 focus:border-slate-400 focus:bg-gray-50 bg-transparent text-sm shadow-[0_0_10px_rgba(0,0,0,0.05)] outline-none placeholder:text-gray-400 focus:outline-none focus:ring-gray-400 focus:ring-opacity-20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-500 dark:bg-gray-700 focus:dark:bg-gray-600 dark:text-gray-50 dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] dark:focus:border-gray-400 dark:focus:outline-none dark:focus:ring-0 dark:focus:ring-gray-400 dark:focus:ring-offset-0';

  useEffect(() => {
    const finalTopic = easyMode ? topic : paraTopic.join(', ');
    setOption(level + ' ' + wordCount + ' ' + finalTopic);
  }, [level, wordCount, topic]);

  return (
	  <div className="h-[490px] overflow-y-auto md:h-[400px]">
      <div className="grid gap-6 sm:grid-cols-2">
	      <div className="col-span-1 flex flex-col items-center justify-start gap-6">
          <div className="grid w-full items-center gap-y-2">
            <Label htmlFor="toneStyle-dropdown" className="text-left text-sm font-medium">
              写作水平 <small className="opacity-40">(默认值: 学士)</small>
            </Label>
            <SelectDropDown
              id='level'
              title={''}
              value={level}
              setValue={(value: string) => setLevel(value)}
              availableValues={['小学三年级', '小学六年级', '初中生', '高中生', '本科生', '学士', '硕士', '博士']}
              disabled={false}
              className={cn(
                defaultTextProps,
                'flex w-full resize-none focus:outline-none focus:ring-0 focus:ring-opacity-0 focus:ring-offset-0'
              )}
              containerClassName="flex w-full resize-none"
              subContainerClassName=''
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="context" className="text-left text-sm font-medium">
              字数 <small className="opacity-40">(默认值: 500)</small>
            </Label>
            <input
              id='wordCount'
              type="number"
              min={'0'}
              value={wordCount || 0}
              onChange={(e) => setWordCount(e.target.value || '0')}
              className={cn(
                defaultTextProps,
                'flex max-h-[300px] min-h-[25px] w-full resize-none px-3 py-2'
              )}
            />
          </div>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-start gap-6">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="context" className="text-left text-sm font-medium">
              段落 <small className="opacity-40">(默认值: 3)</small>
            </Label>
            <input
              id='paragraphCount'
              type="number"
              min='0'
              max="10"
              value={paragraphCount || 0}
              onChange={(e) => setParagraphCount(e.target.value || '0')}
              className={cn(
                defaultTextProps,
                'flex max-h-[300px] min-h-[25px] w-full resize-none px-3 py-2'
              )}
            />
            <div className="grid w-full items-center gap-2">
              <div className='flex flex-row gap-6'>
                <Label htmlFor="context" className="text-left text-sm font-medium">
                主题 <small className="opacity-40">(默认值: 空白)</small>
                </Label>
                <Switch.Root
                  className="w-[30px] h-[16px] bg-blue-500 rounded-full relative data-[state=checked]:bg-violet-700 outline-none cursor-default"
                  id="easy-mode"
                  onCheckedChange={(prev) => setEasyMode(!prev)}
                >
                  <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[13px]" />
                </Switch.Root>
              </div>
              {
                easyMode ? <TextareaAutosize
                  id="topic"
                  disabled={false}
                  value={topic || ''}
                  onChange={(e) => setTopic(e.target.value || '')}
                  className={cn(
                    defaultTextProps,
                    'flex max-h-[300px] min-h-[100px] w-full resize-none px-3 py-2'
                  )}
                /> : paragraphFields
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WritingAssistant;