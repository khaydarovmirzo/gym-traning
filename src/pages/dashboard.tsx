

import TaskForm from '@/components/forms/task-form'
import FillLoading from '@/components/shared/fill-loading'
import ItemTask from '@/components/shared/item.task'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { db } from '@/firebase'
import { taskSchema } from '@/lib/validation'
import { TaskService } from '@/service/task.service'
import { useUserState } from '@/stores/user.store'
import { ITask } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { addMilliseconds, addMinutes, format } from 'date-fns'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { BadgePlus } from 'lucide-react'
import {  useState } from 'react'
import { RiAlertLine } from 'react-icons/ri'
import { toast } from 'sonner'
import { z } from 'zod'

const Dashboard = () => {
	const [isDeleting, setIsDeleting] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [currentTask, setCurrentTask] = useState<ITask | null>(null)
	const [open, setOpen] = useState(false)
	// const [timer, setTimer] = useState(0)

	// useEffect(() => { 
	// 	const intervalId = setInterval(() => 
	// 		{ 
				
	// 			setTimer(prevTimer => prevTimer + 1);
	// 		 }, 1000);

	// 		 return () => clearInterval(intervalId)
	// 		},[]);

	const { user } = useUserState()

	const { isPending, error, data, refetch } = useQuery({
		queryKey: [''],
		queryFn: TaskService.getTasks,
	})

	const onAdd = async ({ title }: z.infer<typeof taskSchema>) => {
		if (!user) return null

		return addDoc(collection(db, 'tasks'), {
			title,
			status: 'unstarted',
			startTime: null,
			endTime: null,
			userId: user.uid,
		})
			.then(() => refetch())
			.finally(() => setOpen(false))
	}

	const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
		if (!user) return null
		if (!currentTask) return null

		const ref = doc(db, 'tasks', currentTask.id)

		return updateDoc(ref, { title })
			.then(() => refetch())
			.finally(() => setIsEditing(false))
			.catch(e => console.log(e))
	}

	const onDelete = async (id: string) => {
		setIsDeleting(true)
		const promise = deleteDoc(doc(db, 'tasks', id))
			.then(() => refetch())
			.finally(() => setIsDeleting(false))

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Successfully deleted!',
			error: 'Something went wrong!',
		})
	}

	const onStartEditing = (task: ITask) => {
		setIsEditing(true)
		setCurrentTask(task)
	}

	const formatDate = (time: number) => {
		const date = addMilliseconds(new Date(0), time)
		const formattedDate = format(addMinutes(date, date.getTimezoneOffset()), 'HH:mm:ss')

		return formattedDate
	}
	 


	return (
		<>
			<div className='h-screen max-w-6xl mx-auto flex items-center max-md:px-6 max-md:pt-[12vh]'>
				<div className='grid lg:grid-cols-2 grid-cols-1 w-full gap-8 items-center'>
					<div className='flex flex-col space-y-3'>
						<div className='w-full p-4 rounded-md flex justify-between bg-gradient-to-t from-background to-secondary'>
							<div className='text-2xl font-bold'>Trainings</div>
							<Button size={'icon'} onClick={() => setOpen(true)}>
								<BadgePlus />
							</Button>
						</div>
						<Separator />
						<div className='w-full p-4 rounded-md flex justify-between bg-gradient-to-b from-background to-secondary relative min-h-60'>
							{(isPending || isDeleting) && <FillLoading />}
							{error && (
								<Alert variant='destructive' className='w-full'>
									<RiAlertLine className='h-4 w-4' />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>{error.message}</AlertDescription>
								</Alert>
							)}
							{data && (
								<div className='flex flex-col space-y-3 w-full'>
									{!isEditing &&
										data.tasks.map(task => (
											<ItemTask
												key={task.id}
												task={task}
												onStartEditing={() => onStartEditing(task)}
												onDelete={() => onDelete(task.id)}
												refetch={refetch}
											/>
										))}
									{isEditing && (
										<TaskForm
											title={currentTask?.title}
											isEdit
											onClose={() => setIsEditing(false)}
											handler={
												onUpdate as (
													values: z.infer<typeof taskSchema>
												) => Promise<void | null>
											}
										/>
									)}
								</div>
							)}
						</div>
					</div>

					<div className='flex flex-col space-y-3 w-full'>
						<div className='p-4 rounded-md bg-gradient-to-r from-blue-900 to-background relative h-24'>
						<div className='text-2xl font-bold'>Total week</div>
							{isPending ? (
                 <FillLoading/>
							) : ( data &&(
							<div className='text-3xl font-bold'>
								{formatDate(data.weekTotal)}</div>
							)
							)}
							
						</div>
						<div className='p-4 rounded-md bg-gradient-to-r from-secondary to-background relative h-24'>
							<div className='text-2xl font-bold'>Total month</div>
							{isPending ? (
                 <FillLoading/>
							) : ( data &&(
							<div className='text-3xl font-bold'>
								{formatDate(data.monthTotal)}</div>
							)
							)}
						</div>
						<div className='p-4 rounded-md bg-gradient-to-r from-destructive to-background relative h-24'>
							<div className='text-2xl font-bold'>Total time</div>
							{isPending ? (
                 <FillLoading/>
							) : ( 
							data &&(
							<div className='text-3xl font-bold'>
								{formatDate(data.total)}</div>
							)
							)}
						</div>
					</div>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger></DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create a new task</DialogTitle>
					</DialogHeader>
					<Separator />
					<TaskForm
						handler={
							onAdd as (
								values: z.infer<typeof taskSchema>
							) => Promise<void | null>
						}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default Dashboard


// import React, { useState, useEffect } from 'react';
// // ... (boshqa importlar)

// const Dashboard = () => {
//   const [open, setOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentTask, setCurrentTask] = useState(null);
//   const [data, setData] = useState(null);
//   const [isPending, setIsPending] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [error, setError] = useState(null);
  
//   //  Timer state qo'shildi 
//   const [timer, setTimer] = useState(0); // Timer state

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setTimer(prevTimer => prevTimer + 1);
//     }, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // ... (boshqa funksiyalar)

//   return (
//     <>
//       <div className='h-screen max-w-6xl mx-auto flex items-center'>
//         <div className='grid grid-cols-2 w-full gap-8 items-center'>
//           <div className='flex flex-col space-y-3'>
//             {/* ... (avvalgi kod) */}
//           </div>

//           <div className='flex flex-col space-y-3 w-full'>
//             {/* ... (avvalgi kod) */}
//           </div>
//         </div>
//       </div>

//       {/*  Timer ko'rsatish qismi qo'shildi  */}
//       <div className='absolute top-4 right-4'>
//         <h2 className='text-2xl'>Timer: {timer} seconds</h2>
//       </div>

//       <Dialog open={open} onOpenChange={setOpen}>
//         {/* ... (avvalgi kod) */}
//       </Dialog>
//     </>
//   );
// }

// export default Dashboard;