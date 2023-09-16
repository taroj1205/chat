module.exports = {
    async redirects() {
        return [
            {
                source: '/channels',
                destination: '/channels/1',
                permanent: true,
            },
        ]
    },
}