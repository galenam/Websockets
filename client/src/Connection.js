function Fetch(url) {
    return fetch(url)
        .then(res => res.json());
}

export default Fetch;