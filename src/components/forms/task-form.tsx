// import { taskSchema } from '@/lib/validation'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'
// import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
// import { Input } from '../ui/input'
// import { useState } from 'react'
// import { Button } from '../ui/button'
// import { addDoc, collection } from 'firebase/firestore'
// import { db } from '@/firebase'
// import { useUserState } from '@/stores/user.store'
// import { toast } from 'sonner'

// const TaskForm = () => {
// 	const [isLoading, setIsLoading] = useState(false)

// 	const {user} = useUserState()

// 	const form= useForm<z.infer<typeof taskSchema>>({
// 		resolver: zodResolver(taskSchema),
// 		defaultValues: { title: '' },
// 	})

//   const onSubmit = async (values: z.infer<typeof taskSchema>) => {
// 		if(!user) return null
// 		const {title} = values
// 		const promise = addDoc(collection(db, 'tasks'), {
// 			title, 
// 			status: 'unstarted',
// 			startTime: null,
// 			endTime: null,
// 			userId: user.uid,
// 		})
// 		toast.promise(promise, {
// 			loading: 'Loading...',
// 			success: 'Successfull',
// 			error: 'Something went werong',
// 		})
// 	}

// 	return <>
// 	  <Form {...form	}>
// 		<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
// 					<FormField
// 						control={form.control}
// 						name='title'
// 						render={({ field }) => (
// 							<FormItem>
// 								<FormControl>
// 									<Input
// 										placeholder='Enter a task'
// 										disabled={isLoading}
// 										{...field}
// 									/>
// 								</FormControl>
// 								<FormMessage />
// 							</FormItem>
// 						)}
// 					/>
// 					</form>
// 					<div className='flex justify-end'>
// 						<Button type='submit' disabled={isLoading}>Submit</Button>
// 					</div>
// 		</Form>
// 	</>
// }

// export default TaskForm


// import { taskSchema } from '@/lib/validation';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
// import { Input } from '../ui/input';
// import { useState } from 'react';
// import { Button } from '../ui/button';
// // import { addDoc, collection } from 'firebase/firestore';
// // import { db } from '@/firebase';
// import { useUserState } from '@/stores/user.store';
// import { toast } from 'sonner';
// import FillLoading from '../shared/fill-loading';

// interface Props {
// 	title?: string
// 	isEdit?: boolean
// 	onClose?: () => void
// 	handler: (values: z.infer<typeof taskSchema>) => Promise<void | null>
// }

// const TaskForm = ({title = '', handler, isEdit, onClose}:Props) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const { user } = useUserState();

//   const form = useForm<z.infer<typeof taskSchema>>({
//     resolver: zodResolver(taskSchema),
//     defaultValues: { title},
//   });

//   const onSubmit = async (values: z.infer<typeof taskSchema>) => {
//     if (!user) return null;

//     setIsLoading(true);
    

    
//       const promise = handler(values).finally(() => setIsLoading(false))
      

//       // toast.promise kutib, xabar ko'rsatish
//        toast.promise(promise, {
//         loading: 'Loading...',
//         success: 'Success!',
//         error: 'Something went wrong',
//       });
    
//   };

//   return (
//     <>
//       {isLoading && <FillLoading />}
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
//           <FormField
//             control={form.control}
//             name='title'
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <Input
//                     placeholder='Enter a task'
//                     disabled={isLoading}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className='flex justify-end gap-2'>
//             {isEdit && (
//             <Button type='button' disabled={isLoading} variant={'destructive'} onClick={onClose}>Cancel</Button>
//             )}
//             <Button type='submit' disabled={isLoading}>Submit</Button>
//           </div>
//         </form>
//       </Form>
//     </>
//   );
// };

// export default TaskForm;


import { taskSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import { useUserState } from '@/stores/user.store';
import { toast } from 'sonner';
import FillLoading from '../shared/fill-loading';

interface Props {
  title?: string;
  isEdit?: boolean;
  onClose?: () => void;
  handler: (values: z.infer<typeof taskSchema>) => Promise<void | null>;
}

const TaskForm = ({ title = '', handler, isEdit, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserState();

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    if (!user) return null;

    setIsLoading(true);
    
    const promise = handler(values).finally(() => setIsLoading(false));

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Success!',
      error: 'Something went wrong',
    });
  };

  return (
    <>
      {isLoading && <FillLoading />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Enter a task'
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            {isEdit && (
              <Button type='button' disabled={isLoading} variant='destructive' onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type='submit' disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;