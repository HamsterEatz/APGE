'use client';
import whitelist from '../../../whitelist.json';

export default function Whitelist() {
    const users = whitelist.users;

    async function onFormSubmit(e: any) {
        e.preventDefault();
        const target = e.target;
        const formData = new FormData(target);
        const email = formData.get('email');
        if (!email) {
            return alert('Missing email!');
        }
        const res = await fetch('/api/whitelist', {
            method: 'POST',
            body: formData
        });
        if (res.status === 201) {
            e.target.reset();
        }
        alert(res.statusText);
    }

    async function onEmailDelete(e: any, email: string) {
        e.preventDefault();
        const res = await fetch('/api/whitelist', {
            method: 'DELETE',
            body: JSON.stringify({ email })
        });
        alert(res.statusText);
    }

    return (<main className='container mx-auto aspect-auto text-center'>
        <div className="inline-flex items-center">
            <h1 className="mx-12 mt-6 text-2xl pb-4 font-bold">Whitelist</h1>
        </div>
        <form className="py-4 mx-12 border" onSubmit={onFormSubmit}>
            {users?.length ? <div className='py-4 border mx-12 mb-6 bg-slate-100'>
                <h4 className="font-bold text-lg underline pb-2">Current list of whitelisted users:</h4>
                <ol className="list-inside list-decimal">
                    {users.map((v: string, k: number) => 
                        <li key={k}>
                            {v}
                            <button type="button" id={v} onClick={(e) => onEmailDelete(e, v)} className="ml-4 mt-2 rounded-md bg-red-600 px-3 py-2 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">x</button>
                        </li>
                    )}
                </ol>
            </div> : <></>}
            <label htmlFor="email" className="pr-2">Add email to whitelist:</label>
            <input type="email" id="email" name="email" className="rounded-md flex-1 border-0 bg-gray-100 p-2" required></input>
            <button type="submit" className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
        </form>
    </main>);
}