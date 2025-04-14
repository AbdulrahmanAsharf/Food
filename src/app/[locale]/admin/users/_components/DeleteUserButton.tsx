'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { deleteUser } from '../_actions/user'
import { toast } from 'sonner'

function DeleteUserButton({ userId }: { userId: string }) {
    const handleDelete = async (id: string) => {
    try {
        const res = await deleteUser(id)
        if (res.status === 200) {
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    } catch (error) {
        console.error(error)
        toast.error('حصل خطأ أثناء الحذف 😥')
    }
}

    return (
    <Button
        type="button"
        variant="outline"
        onClick={() => handleDelete(userId)}
    >
        <Trash2 />
    </Button>
    )
}

export default DeleteUserButton
