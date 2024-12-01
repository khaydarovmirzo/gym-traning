import { Skeleton } from '../ui/skeleton'
import { RiLoader2Fill } from "react-icons/ri";

const FillLoading = () => {
	return (
		<Skeleton className='absolute inset-0 flex justify-center items-center w-full h-full opacity-20 z-50'>
			<RiLoader2Fill className='animate-spin w-6 h-6' />
		</Skeleton>
	)
}

export default FillLoading
