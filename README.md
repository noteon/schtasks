# schtasks

Windows scheduled tasks

* [Install](#install)
* [How to use it](#example)

<a name="install"></a>
## Install

To install schtasks, simply use npm:

```
npm install schtasks --save
```

<a name="example"></a>
## How to use it

```javascript
const sc = require('schtasks')

await st.create('TestTask', {
	taskrun: 'C:\\TaskPath\\task.exe',
	schedule: 'WEEKLY',
	days: ['MON', 'TUE'],
	interval: 15,
	starttime: '00:00',
	duration: '24:00'
})

await st.get('TestTask')

await st.run('TestTask')

await st.stop('TestTask')

await st.update('TestTask', {
	disable: null
})

await st.destroy('TestTask')

/*
 Available options

 schedule
 modifier
 days
 months
 idletime
 taskname
 taskrun
 starttime
 interval
 endtime
 duration
 startdate
 enddate
 level
 enable
 disable
*/
```