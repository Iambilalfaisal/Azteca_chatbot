import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Chip
} from '@mui/material'
import { 
  LocationOn, 
  Restaurant, 
  Phone, 
  AccessTime,
  Star
} from '@mui/icons-material'

const DemoPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Welcome to Sunset Bistro
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                opacity: 0.95,
                fontWeight: 300,
                maxWidth: '600px'
              }}
            >
              Fresh, Local, and Delicious Dining Experience
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '700px',
                fontSize: '1.1rem',
                lineHeight: 1.8
              }}
            >
              Experience exceptional dining with our chef-inspired menu featuring locally sourced ingredients. 
              From gourmet entrees to artisanal desserts, we bring fine dining to your neighborhood.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  bgcolor: 'white', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  px: 4,
                  py: 1.5
                }}
              >
                View Menu
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 4,
                  py: 1.5
                }}
              >
                Find Locations
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Features Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Restaurant 
                  sx={{ 
                    fontSize: 60, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Our Menu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Discover our chef-curated selection of seasonal dishes, from signature entrees 
                  to artisanal desserts. Every dish is prepared with fresh, locally sourced ingredients.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <LocationOn 
                  sx={{ 
                    fontSize: 60, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Multiple Locations
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Find us at multiple locations throughout the region. 
                  Visit us today for dine-in, takeout, or delivery.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Phone 
                  sx={{ 
                    fontSize: 60, 
                    color: 'primary.main', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Easy Ordering
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Order online or call ahead for quick pickup. We make it easy to enjoy 
                  exceptional dining whenever you want.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Info Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
            mb: 4
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Chip 
                  icon={<Star />} 
                  label="Award Winning" 
                  color="primary" 
                  sx={{ width: 'fit-content' }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Why Choose Sunset Bistro?
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  We've been serving exceptional cuisine for over a decade. 
                  Our commitment to quality, fresh ingredients, and innovative recipes has made us 
                  a favorite among food enthusiasts and locals alike.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime color="primary" />
                    <Typography variant="body2">Fast Service</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star color="primary" />
                    <Typography variant="body2">Fresh Ingredients</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 300,
                  borderRadius: 2,
                  bgcolor: 'primary.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 600
                }}
              >
                Image Placeholder
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* CTA Section */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Need Help? We're Here for You
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Have questions about our menu, locations, or services? Click the chat button 
            in the bottom right corner to speak with our AI assistant.
          </Typography>
          <Chip 
            label="💬 Click the chat widget to get started" 
            color="primary" 
            sx={{ fontSize: '0.9rem', py: 2.5, px: 1 }}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default DemoPage

