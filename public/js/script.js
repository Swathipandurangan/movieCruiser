let moviesList = [];
let favouritesList = [];

function handleError(response) {
	if(response.status === 404) {
		return Promise.reject(new Error('Invalid URL..'));
	} else if(response.status === 500) {
		return Promise.reject(new Error('Some internal error occurred..'));
	} else if(response.status === 401) {
		return Promise.reject(new Error('UnAuthorized User..'));
	}
	return Promise.reject(new Error('Generic Error..'));
}

function displayError(errorElement, error) {
	errorElement.innerHTML = error.message;
	if (errorElement.style.display === 'none') {
		errorElement.style.display = 'block';
	}
}

function hideError(errorElement) {
	if (errorElement) {
		errorElement.style.display = 'none';
	}
}

function getMovies() {
	hideError(document.getElementById('errMessage'));
	return fetch('http://localhost:3000/movies').
	then(response => {		
        if(response.ok) {
			return Promise.resolve(response.json());
        }
		return Promise.reject(handleError(response));
	})
	.then(response => {
		moviesList = response;
		const ulEle = document.getElementById('moviesList');
		let liEleString = '';
		response.forEach(movie =>{
			liEleString = liEleString +
			`<li class='list-group-item d-flex justify-content-between align-items-center'>
				<div>	
					<h4>${movie.title}</h4>
					<img src=${movie.posterPath} alt="..." class="img-thumbnail poster">
				</div>				
				<button type="button" class="btn btn-primary" onclick='addFavourite(${movie.id})'>Add to Favourites</button>
			</li>`;
		});
		ulEle.innerHTML = liEleString;
		return Promise.resolve(response);
	})
	.catch(error => {
		displayError(document.getElementById('errMessage'), error);
		return Promise.reject(error);
	});
}

function getFavourites() {
	hideError(document.getElementById('favErrMessage'));
	return fetch('http://localhost:3000/favourites').
	then(response => {		
        if(response.ok) {
			return Promise.resolve(response.json());
        }
		return Promise.reject(handleError(response));
	})
	.then(response => {
		favouritesList = response;
		const ulEle = document.getElementById('favouritesList');
		let liEleString = '';
		response.forEach(movie =>{
			liEleString = liEleString +
			`<li class='list-group-item d-flex justify-content-between align-items-center'>
				<div>	
					<h4>${movie.title}</h4>
					<img src=${movie.posterPath} alt="..." class="img-thumbnail poster">
				</div>
			</li>`;
		});
		ulEle.innerHTML = liEleString;
		return Promise.resolve(response);
	})
	.catch(error => {
		displayError(document.getElementById('favErrMessage'), error);
		return Promise.reject(error);
	});
}

function addFavourite(movieId) {
	const favArray = favouritesList && favouritesList.length > 0 ? favouritesList.filter(fav => fav.id === movieId) : [];
	if (favArray && favArray.length > 0) {
		return Promise.reject(new Error('Movie is already added to favourites'));
	}
	const movieToAddAsFav = moviesList.length > 0 ? moviesList.filter(movie => movie.id === movieId) : [];
	const movie = movieToAddAsFav.length > 0 ? movieToAddAsFav[0] : {};
	return fetch('http://localhost:3000/favourites', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify(movie)
	})
	.then(response => {
		if(response.ok) {
			return Promise.resolve(response.json());
		}
		return handleError(response);
	})
	.then(res => {
		favouritesList.push(res);
		const ulEle = document.getElementById('favouritesList');
		let liEleString = '';
		favouritesList.forEach(favMovie =>{
			liEleString = liEleString +
			`<li class='list-group-item d-flex justify-content-between align-items-center'>
				<div>	
					<h4>${favMovie.title}</h4>
					<img src=${favMovie.posterPath} alt="..." class="img-thumbnail poster">
				</div>
			</li>`;
		});
		ulEle.innerHTML = liEleString;
		return Promise.resolve(favouritesList);
	})
	.catch(error => {
		displayError(document.getElementById('errMessage'), error);
		return Promise.reject(new Error('Dummy error from server'));
	});
}

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};

// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


