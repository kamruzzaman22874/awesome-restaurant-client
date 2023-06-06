import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useCart from '../../hooks/UseCart ';
import { AuthContext } from '../../providers/AuthProvider';

const FoodCard = ({ item }) => {
	const { name, image, price, recipe, _id } = item;
	const { user } = useContext(AuthContext);
	const [,refetch] = useCart()
	const navigate = useNavigate();
	const location = useLocation();
	const handleAddToCart = (item) => {
		console.log(item);
		if (user && user?.email) {
			const cartItem = { menuItemId: _id, name, image, price, email: user?.email };
			fetch('http://localhost:5000/carts', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(cartItem)
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.insertedId) {
						refetch()
						Swal.fire({
							position: 'top-end',
							icon: 'success',
							title: 'Food added in the cart',
							showConfirmButton: false,
							timer: 1500,
						});
					}
				});
		} else {
			Swal.fire({
				title: 'Please login to order the food',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Login now!',
			}).then((result) => {
				if (result.isConfirmed) {
					navigate('/login', { state: { from: location } });
				}
			});
		}
	};
	return (
		<div className='card  bg-base-100 shadow-xl'>
			<figure className='px-10 pt-10'>
				<img src={image} alt='Shoes' className='rounded-xl' />
			</figure>
			<p className='bg-slate-900 text-white absolute right-0 mr-10 mt-10 px-4'>
				${price}
			</p>
			<div className='card-body flex flex-col items-center '>
				<h2 className='card-title'>{name}</h2>
				<p>{recipe}</p>
				<div className='card-actions'>
					<button
						onClick={() => handleAddToCart(item)}
						className='btn btn-outline bg-slate-100 border-0 border-b-4 border-orange-400 mt-4'>
						Add to cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default FoodCard;