// next.js custom hooks
import { useRouter } from 'next/router'

export default function User() {
    // open an instance of useRouter
    const router = useRouter()
    // pull the path param from the router object
    const { uid } = router.query

    return (
        <div>
            <h1>Hello User { uid }!</h1>
        </div>
    )
}