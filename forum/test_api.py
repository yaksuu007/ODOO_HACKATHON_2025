#!/usr/bin/env python3
"""
Simple test script to verify the Venue Booking API endpoints
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get("http://localhost:5000/health")
        print(f"Health check status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print("❌ Health check failed")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the Flask app is running.")
        return False

def test_register():
    """Test user registration"""
    print("\nTesting user registration...")
    
    user_data = {
        "fullname": "Test User",
        "email": "test@example.com",
        "password": "testpass123",
        "contact_number": "9876543210",
        "designation": "player"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/register", json=user_data)
        print(f"Registration status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Registration successful")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\nTesting user login...")
    
    login_data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/login", json=login_data)
        print(f"Login status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login successful")
            # Get cookies for authenticated requests
            cookies = response.cookies
            return cookies
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_get_venues(cookies):
    """Test getting venues"""
    print("\nTesting get venues...")
    
    try:
        response = requests.get(f"{BASE_URL}/venues", cookies=cookies)
        print(f"Get venues status: {response.status_code}")
        
        if response.status_code == 200:
            venues = response.json()
            print(f"✅ Retrieved {len(venues)} venues")
            return True
        else:
            print(f"❌ Get venues failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Get venues error: {e}")
        return False

def test_create_venue(cookies):
    """Test creating a venue (requires facilities user)"""
    print("\nTesting venue creation...")
    
    # First, we need to create a facilities user
    facilities_user = {
        "fullname": "Facility Owner",
        "email": "facility@example.com",
        "password": "facility123",
        "contact_number": "1234567890",
        "designation": "facilities"
    }
    
    try:
        # Register facilities user
        response = requests.post(f"{BASE_URL}/register", json=facilities_user)
        if response.status_code == 201:
            print("✅ Facilities user created")
            
            # Login as facilities user
            login_response = requests.post(f"{BASE_URL}/login", json={
                "email": "facility@example.com",
                "password": "facility123"
            })
            
            if login_response.status_code == 200:
                facility_cookies = login_response.cookies
                
                # Create venue
                venue_data = {
                    "address": "123 Sports Street, Test City",
                    "court_name": "Test Tennis Court",
                    "per_hr_charge": 25.00,
                    "operating_days": "Mon-Sun",
                    "operating_hours": "6 AM - 10 PM",
                    "sports": "Tennis, Badminton"
                }
                
                venue_response = requests.post(f"{BASE_URL}/venue", json=venue_data, cookies=facility_cookies)
                print(f"Venue creation status: {venue_response.status_code}")
                
                if venue_response.status_code == 201:
                    print("✅ Venue created successfully")
                    return True
                else:
                    print(f"❌ Venue creation failed: {venue_response.text}")
                    return False
            else:
                print("❌ Facilities user login failed")
                return False
        else:
            print("❌ Facilities user creation failed")
            return False
            
    except Exception as e:
        print(f"❌ Venue creation error: {e}")
        return False

def test_search_venues():
    """Test venue search"""
    print("\nTesting venue search...")
    
    try:
        response = requests.get(f"{BASE_URL}/search/venues?q=tennis")
        print(f"Search status: {response.status_code}")
        
        if response.status_code == 200:
            results = response.json()
            print(f"✅ Search returned {len(results)} results")
            return True
        else:
            print(f"❌ Search failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Search error: {e}")
        return False

def run_tests():
    """Run all tests"""
    print("🚀 Starting Venue Booking API Tests\n")
    
    # Test health check
    if not test_health_check():
        print("\n❌ Health check failed. Stopping tests.")
        return
    
    # Test registration
    if not test_register():
        print("\n❌ Registration test failed.")
        return
    
    # Test login
    cookies = test_login()
    if not cookies:
        print("\n❌ Login test failed.")
        return
    
    # Test getting venues
    test_get_venues(cookies)
    
    # Test venue creation
    test_create_venue(cookies)
    
    # Test search
    test_search_venues()
    
    print("\n🎉 All tests completed!")

if __name__ == "__main__":
    run_tests()
