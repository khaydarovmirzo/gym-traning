import { useUserState } from '@/stores/user.store'
import { LogOut, LucideLoader2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useNavigate } from 'react-router-dom'
import { auth } from '@/firebase'
import {CgGym } from 'react-icons/cg'

const UserBox = () => {
	const{user, setUser} = useUserState()
	const navigate = useNavigate()
	if(!user) return <LucideLoader2 className='animate-spin'/>

	const onLogout = () => {
		 auth.signOut().then(() => {
			setUser(null)
			navigate('/auth')
		 })
	}


	return <DropdownMenu>
		<DropdownMenuTrigger asChild>
     <Avatar className='cursor-pointer'>
		 <AvatarImage src={user.photoURL!} />
		 <AvatarFallback className='uppercase'>{user.email![0]}</AvatarFallback>
		 </Avatar>
		</DropdownMenuTrigger>
		<DropdownMenuContent
		className='w-80'
		align='start'
		alignOffset={11}
		forceMount
		>
    <div className='flex flex-col space-y-4 p-2'>
			<p className='text-xs font-medium leading-none text-muted-foreground cursor-pointer'>
				 {user.email}
			</p>
			<div className='flex items-center gap-x-2'>
        <div className='rounded-md bg-secondary/50 p-1'>
				<Avatar>
		     <AvatarImage src={user.photoURL!} />
		     <AvatarFallback className='uppercase'>{user.email![0]}</AvatarFallback>
		    </Avatar>
				</div>
				<div className='space-y-1'>
					<p className='line-clamp-1 text-sm'>
             {user.displayName ?? user.email}
					</p>
				</div>
			</div>
		</div>
		<DropdownMenuSeparator/>
		<DropdownMenuGroup>
		<DropdownMenuItem className='cursor-pointer' onClick={onLogout}>
       <CgGym className='w-4 h-4 mr-2' />
			 <span>Gym</span>
			</DropdownMenuItem>
			<DropdownMenuItem className='cursor-pointer bg-destructive' onClick={onLogout}>
       <LogOut className='w-4 h-4 mr-2' />
			 <span>Logout</span>
			</DropdownMenuItem>
		</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
}

export default UserBox
