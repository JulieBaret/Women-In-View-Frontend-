// React
import React, { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

// Components
import { useAuth } from '../contexts/AuthContext';
import ActiveNavLink from '../components/ActiveNavLink';
import FullScreenLoading from '../components/FullScreenLoading';
import SearchBar from '../components/SearchBar';

// Icons
import { HiCog, HiLogout, HiViewGrid } from 'react-icons/hi';

// External components
import { Dropdown } from 'flowbite-react';
import toast, { Toaster } from 'react-hot-toast';

// Hooks
import { useFetch } from '../hooks/useFetch';

export default function ProtectedLayout() {
	const { user, token } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const navigate = useNavigate();

	const handleOpenMenu = () => {
		setIsMenuOpen((prev) => !prev);
	}

	// if user is not logged in, redirect to login page
	if (!user) {
		return <Navigate to="/" />;
	}

	// logout user
	const handleLogout = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(import.meta.env.VITE_API_URL + 'logout', {
				method: 'POST',
				withCredentials: true,
				headers: {
					Accept: 'application/json',
					Authorization: 'Bearer ' + token
				}
			});

			if (!response.ok) {
				throw new Error(`Error! status: ${response.status}`);
			}

			if (response.status === 200) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				window.location.href = '/';
			}
		} catch (err) {
			toast('Error while signing out: ' + error);
			console.log(error)
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		if (searchValue.length < 3 | searchValue.length > 20) {
			toast('Search should be between 3 and 20 characters')
			return;
		}
		navigate(`/search/${searchValue}`);
		setSearchValue("");
	}

	return (
		<>
			{isLoading && <FullScreenLoading label="We hope to see you soon!" />}
			<nav className="bg-gradient-to-r from-primary to-secondary py-2.5 px-4 z-30">
				<Toaster />
				<div className="flex flex-wrap items-center justify-between">
					<NavLink className='flex gap-2' to="/home">
						<img src="/icon.png" className="h-9" alt="Women in view logo" />
						<span className='self-center text-3xl font-bold text-light whitespace-nowrap hidden sm:block'>Women in View</span>
					</NavLink>
					<div className="flex lg:gap-10">
						<button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-300 rounded-lg lg:hidden hover:text-light focus:outline-none order-last" onClick={handleOpenMenu}>
							{isMenuOpen ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
								: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
									<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
								</svg>}
						</button>
						<div className="hidden w-full lg:block lg:w-auto">
							<ul className="flex flex-col lg:flex-row text-center text-gray-300 lg:mb-0 mb-4">
								<li>
									<ActiveNavLink label="Home" location="/home" />
								</li>
								<li>
									<ActiveNavLink label="Last reviews" location="/last-reviews" />
								</li>
								{/* <li>
								<div className="flex w-[110px]">
									<button
										onClick={handleLogout}
										className="block py-2 pl-3 pr-4 hover:underline underline-offset-8">
										Logout
									</button>
									{isLoading && <Loading />}
								</div>
							</li> */}
							</ul>
						</div>
						<SearchBar onSubmit={handleSearch} onChange={(e) => setSearchValue(e.target.value)} value={searchValue} label="Search" placeholder="Search for a movie..." />
						<div className='flex gap-2 items-center'>
							{/* Dropdown profile menu */}
							<Dropdown
								arrowIcon={false}
								inline
								label={
									<div className='flex gap-2 items-center' onClick={() => setIsMenuOpen((false))}>
										<span className='font-bold text-white hidden w-full lg:block lg:w-auto'>Hi, {user.name}!</span>
										<img src="/profile.png" className='h-10 hover:opacity-80 transition ease-in-out' />
										{/* <Avatar className='rounded-full' alt="User settings" img="/profile.png" rounded /> */}
									</div>
								}
							>
								<Dropdown.Header>
									<span className="block text-sm">{user.name}</span>
									<span className="block truncate text-sm font-medium">{user.email}</span>
								</Dropdown.Header>
								<Dropdown.Item icon={HiViewGrid}><NavLink to="/reviews">My reviews</NavLink></Dropdown.Item>
								<Dropdown.Item icon={HiCog}><NavLink to="/profile">Profile settings</NavLink></Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item icon={HiLogout} onClick={handleLogout}>Sign out</Dropdown.Item>
							</Dropdown>
						</div>
					</div>
				</div>
				{isMenuOpen && <div className="h-auto lg:hidden flex flex-col text-center text-gray-300 mt-2">
					<ul onClick={handleOpenMenu}>
						<li>
							<ActiveNavLink label="Home" location="/home" />
						</li>

						<li>
							<ActiveNavLink label="Last reviews" location="/last-reviews" />
						</li>
						{/* <li>
							<ActiveNavLink label="The Bechdel Test" location="/about" />
						</li> */}
						{/* <li>
								<div className="flex w-[110px]">
									<button
										onClick={handleLogout}
										className="block py-2 pl-3 pr-4 hover:underline underline-offset-8">
										Logout
									</button>
									{isLoading && <Loading />}
								</div>
							</li> */}
					</ul>
				</div>}
			</nav>
			<div>
				<Outlet />
			</div>
		</>
	);
}