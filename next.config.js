module.exports = {
    images: {
        domains: ['www.gravatar.com', 'xtfywqvybzosyisgztuw.supabase.co'],
    },
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