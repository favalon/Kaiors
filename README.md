# Leran Language By Scene 基于场景的语言学习

在英语学习的过程中，我发现正确的语言学习模式应该是 熟悉-> 使用-> 语法-> **逻辑**->精通。也只有这样才能将语言作为一种“工具”真正的掌握，而非仅仅提高考试成绩。

而目前的语言学习软件大多是基于单词的记忆和语法学习，其目的在于提高考试成绩而非掌握语言。而Chatgpt等LLM的出现让基于**使用**的场景化语言学习方式得以成型。因此我开发了这个基于跟读，场景互动的语言学习工具。

由于主要是个人使用，目前主要数据为日语学习数据。使用时可以通过修改数据文件来适配其他语言。

## Demo page

国外Vercel版本（每日更新）: [learn-language-by-scene Vercel Page](https://learn-language-by-scene.vercel.app/)

国内版本测试网页 : [learn-language-by-scene](https://kairsgpt.bolone.cn/) 
* 国内测试网页只有大变化才会更新 *

## Local Development

```bash
npm install
npm run dev
```

or

```bash
pnpm install
pnpm run dev
```
## 添加 OpenAI API Key
在.env.local.example 或 .env.example 文件中添加自己的
- OpenAI API Key： 用于场景对话 
- Azure API Key ： 用于Azure语音合成的tts服务

然后将文件名改为 .env.local 或 .env。选择使用哪个文件取决于你的开发环境。

## 数据
目前所有的数据都在public文件夹下，音频数据在public/audio中，调取音频数据的文件在public/public/jp_practice_data/中，可以根据自己的需要修改。

其中 public/jp_practice_data/practice_data_info.json 是所有音频数据的索引文件，可以根据自己的需要修改。而public/jp_practice_data/main_page_list_info.json可以设定主页显示内容。

### 跟读数据生成
数据生成可以参考我的另一个 repo # todo。可以自行生成更多自己需要的数据。 

### 互动场景
只需要在 main_page_list_info.json  修改或添加 对应的场景与 prompt 即可

## Live2D 模型
目前使用的是 [Live2D Cubism SDK for Web](https://www.live2d.com/download/cubism-sdk/download-web/)

相关的模型文件在public/Resources中，如果需要更换模型，可以在这里替换。bundle.js中的模型加载代码也需要修改。目前模型主要用于lip-sync和基于得分的表情动作变化。所以bundle.js中我只添加了这一部分代码，如果需要更多的动作，可以参考Live2D官方文档添加。

## 后续
由于我并非专业的程序员，此项目代码几乎都是我用chatgpt完成的。本工具的开发更多是基于我个人需求和兴趣。另一方面这个项目是另一个项目改编而来且没有清理，所以这个项目的结构和代码质量都不高。

如果有人有兴趣一起开发完善此项目，可以联系我。