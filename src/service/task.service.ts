

// import { db } from '@/firebase';
// import { ITask, ITaskData } from '@/types';
// import { collection, getDocs, query } from 'firebase/firestore';
// import {endOfMonth, endOfWeek, isWithinInterval, startOfMonth, startOfWeek} from 'date-fns'

// export const TaskService = {
//   getTasks: async () => {
//     let weekTotal = 0; // Haftalik umumiy hisob
//     let monthTotal = 0; // Oylik umumiy hisob
//     let total = 0; // Umumiy hisob

//     const now = new Date()
//     const weekStart = startOfWeek(now)
//     const weekEnd = endOfWeek(now)
//     const monthStart = startOfMonth(now)
//     const monthEnd = endOfMonth(now)

//     const q = query(collection(db, 'tasks'));
//     const querySnapshot = await getDocs(q);

//     querySnapshot.docs.forEach(doc => {
//       const data = doc.data()
//       const taskData = new Date(data.startTime)
//       const taskTime = data.totalTime || 0

//       if(isWithinInterval(taskData, {start: weekStart, end:weekEnd})) {
//         weekTotal += taskTime
//       }
//       if(isWithinInterval(taskData, {start: monthStart, end:monthEnd})) {
//         monthTotal += taskTime
//       }
//       total += taskTime
//      })

//     // Qolgan kod bajarilishi uchun erta qaytishni olib tashlang
//     const tasks = querySnapshot.docs.map(doc => ({
//       ...doc.data(),
//       id: doc.id,
//     })) as ITask[];

//     // Bu yerda weekTotal, monthTotal va totalni hisoblashni amalga oshiring
//     total = tasks.length; // Umumiy hisob uchun misol

//     const taskData: ITaskData = {
//       tasks,
//       weekTotal,
//       monthTotal,
//       total,
//     };

//     return taskData;
//   },
// };


import { auth, db } from '@/firebase'
import { ITask, ITaskData } from '@/types'
import {
	endOfMonth,
	endOfWeek,
	isWithinInterval,
	startOfMonth,
	startOfWeek,
} from 'date-fns'
import { collection, getDocs, query, where } from 'firebase/firestore'

export const TaskService = {
	getTasks: async () => {
		let weekTotal = 0
		let monthTotal = 0
		let total = 0

		const now = new Date()
		const weekStart = startOfWeek(now)
		const weekEnd = endOfWeek(now)
		const monthStart = startOfMonth(now)
		const monthEnd = endOfMonth(now)

		const q = query(collection(db, 'tasks'),
			where('userId', '==', auth.currentUser?.uid)
		)
		const querySnapshot = await getDocs(q)

		querySnapshot.docs.forEach(doc => {
			const data = doc.data()
			const taskDate = new Date(data.startTime)
			const taskTime = data.totalTime || 0

			if (isWithinInterval(taskDate, { start: weekStart, end: weekEnd })) {
				weekTotal += taskTime
			}
			if (isWithinInterval(taskDate, { start: monthStart, end: monthEnd })) {
				monthTotal += taskTime
			}
			total += taskTime
		})

		const tasks = querySnapshot.docs.map(doc => ({
			...doc.data(),
			id: doc.id,
		})) as ITask[]

		const taskData: ITaskData = {
			tasks,
			weekTotal,
			monthTotal,
			total,
		}

		return taskData
	},
}
