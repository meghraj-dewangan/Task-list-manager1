import { ReactTabulator } from 'react-tabulator';
import 'tabulator-tables/dist/css/tabulator.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import react, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faPlus,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import "./Body.css";





function Body() {

    const [tasks, setTasks] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
   const [showSearch, setShowSearch] = useState(false);

    async function fetchTasks() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/todos");
            if (!response.ok) {
                setErrorMsg("Failed to fetch Tasks");

                return;

            }
            const data = await response.json();
            const fetchedTasks = data.slice(0, 20).map((task) => ({
                id: task.id,
                title: task.title,
                description: "",
                status: task.completed ? 'Done' : 'To Do',
            }));
            setTasks(fetchedTasks);
            console.log(fetchedTasks);


        } catch (error) {
            setErrorMsg("Failed to fetch Tasks");
            console.log("Error fetching tasks:", error);
            toast.error("Failed to fetch Tasks.");
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);


    function openSearch() {
        setShowSearch(true);
        setTimeout(() => {
            setShowSearch(false);  // Hide the search input after 5 seconds
        }, 5000);
    }

    function addTask() {
        const newTask = {
            id: tasks.length + 1,
            title: 'New Task',
            description: '',
            status: 'To Do',
        };
        setTasks([...tasks, newTask]);
        toast.success('Task added successfully!');
    };

    function deleteTask(id) {
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted successfully');
    };



    const filteredTasks = tasks.filter(task => 
        (statusFilter ? task.status === statusFilter : true) &&
        (searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       task.description.toLowerCase().includes(searchQuery.toLowerCase()) : true)
    );


    const columns = [
        { title: 'Task ID', field: 'id', width: 90, align: 'center' },
        { title: 'Title ', field: 'title', editor: 'input', width: 460 },
        { title: 'Description', field: 'description', editor: 'input', width: 470 },
        {
            title: 'Status',
            field: 'status',
            editor: 'select',
            width: 90,
            align: 'center',
            editorParams: {
                values: ['To Do', 'In Progress', 'Done'],
            },
        },
        {
            title: 'Action',
            formatter: function (cell) {

                return `<i  class="fas fa-trash text-red-600 "></i>`;
            },
            width: 90,
            align: 'center',
            cellClick: (e, cell) => {
                deleteTask(cell.getRow().getData().id);
            },
        },
    ];



    return (
        <div className='p-6 min-h-screen bg-gradient-to-r from-slate-900 to-blue-400 font-serif'>
            <ToastContainer />
            <div className='sm:w-2/3 w-full   lg:mt-14 mx-auto bg-white rounded-lg shadow-md p-3'>

                {/*Header */}
                <div className=' font-bold text-2xl'>
                    <h1 className='text-base lg:text-2xl  font-bold  mb-6 text-center'> <span className='text-blue-700'>Task</span> <span className='text-orange-500'>List </span><span>Manager</span></h1>


                </div>

                {/*Add Task Button */}

                <div className="flex justify-between items-center mb-3 ">


                    <button onClick={addTask} className='bg-green-500 hover:scale-110 transition-all text-white text-xs lg:text-base rounded-md shadow-md px-2'>
                        <FontAwesomeIcon icon={faPlus} /> Add Task
                    </button>

                    {/* Search button */}
                    <button className='hidden sm:block hover:scale-125 p-1 text-blue-500 transition-all'
                    onClick={openSearch}

                    >
                       <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>

                    {/*Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='shadow-md text-xs lg:text-base  rounded-md bg-gray-600 text-white'
                    >
                        <option value="">All</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value=" Done"> Done</option>
                    </select>


                </div>

 {/* Search Bar for large screen */}
            {showSearch && (
                <div className='mb-3 shadow-md rounded-lg border'>
                    <input type="text" 
                    className='hidden sm:block bg-blue-400 text-white  rounded-lg py-1 px-2 w-full '
                  placeholder="Search tasks... "
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    />

                </div>
            )}


                {/* Search Bar for small screen */}
                <div className='mb-3 sm:hidden'>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks... "
                        className='w-full px-3 py-1 bg-blue-400 text-white text-xs border rounded shadow-md focus:outline-none'
                    />
                </div>

                {/*Task Table */}

                <div className='overflow-x-auto flex '>
                    <ReactTabulator
                        data={filteredTasks}
                        columns={columns}
                        options={{
                            pagination: "local",
                            paginationSize: 10,
                        }}
                        className='tabulatorbody border w-full   h-60 md:h-80 lg:h-96 rounded shadow-md text-black text-base '
                        cellEdited={(cell) => {
                            const updatedTasks = tasks.map((task) =>
                                task.id === cell.getData().id ? { ...task, ...cell.getData() } : task
                            );
                            setTasks(updatedTasks);
                            toast.success('Task Edited Successfully!');
                        }}
                        resizableColumns={true}

                    />
                </div>



                {/*Task counter */}

                <div className='bg-gradient-to-l from-slate-900 to-blue-400 text-xs text-white lg:text-base text-center mt-2 bg-orange-100 p-4 rounded shadow-md  '>
                    <p className='text-lg font-semibold'><span className='text-orange-600'>Task</span> Summary</p>
                    <div className='lg:flex lg:justify-center lg:flex-row flex flex-col  mt-4 '>
                        <div> <p className='lg:mr-1 inline' >Total Tasks:</p><span>{tasks.length}</span></div>


                        <div> <p className='lg:mr-1 lg:ml-8 inline'>To Do:</p><span>{tasks.filter(task => task.status === 'To Do').length}</span></div>
                        <div> <p className='lg:mr-1 lg:ml-8 inline'>In Progress:</p><span>{tasks.filter(task => task.status === 'In Progress').length}</span></div>
                        <div> <p className='lg:mr-1 lg:ml-8 inline'>Done:</p><span>{tasks.filter(task => task.status === 'Done').length}</span></div>
                    </div>


                </div>

            </div>


        </div>
    )
}
export default Body;