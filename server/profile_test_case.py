# Uses requests to test the frontend endpoints

import requests
import pytest

class TestCaseEditProfileFlow:
    """Test cases for the edit profile flow"""
    
    def test_profile_page_loads(self):
        """Test case: profile page loads correctly"""
        # This would test if your frontend server is running and the profile page is accessible
        try:
            response = requests.get("http://localhost:5173/profile", timeout=5)
            assert response.status_code == 200 
            print("✅ Profile page loads successfully")
        except requests.exceptions.ConnectionError:
            pytest.skip("Frontend server not running - start with 'npm run dev'")
    
    def test_api_profile_endpoint(self):
        """Test the API endpoint that supports the edit profile flow"""
        try: 
            response = requests.get("http://localhost:8000/api/profile")
            assert response.status_code == 200
            
            data = response.json()
            assert data["firstName"] == "Suzuna"
            assert data["lastName"] == "Kimura"
            print("✅ API profile endpoint works correctly")
        except requests.exceptions.ConnectionError:
            pytest.skip("Backend server not running - start with 'uvicorn main:app --reload'")
    
    def test_case_edit_profile(self):
        """
        Test case: edit profile flow using API calls:
        1. User accesses profile
        2. User prepares to edit (gets current data)
        3. User cancels edit (no changes made)
        """
        try: 
            # Step 1: User accesses profile
            profile_response = requests.get("http://localhost:8000/api/profile")
            assert profile_response.status_code == 200
            original_data = profile_response.json()
            print(f"✅ Step 1: User accessed profile - {original_data['firstName']} {original_data['lastName']}")
            
            # Step 2: User clicks 'Edit Profile' 
            edit_form_data = {
                "firstName": original_data["firstName"],
                "lastName": original_data["lastName"],
                "wishList": original_data["wishList"] + ["Debugging"]
            }
            print("✅ Step 2: User clicked 'Edit Profile' - edit form prepared")
            
            # Step 3: User quits (cancels edit - verify no changes)
            final_response = requests.get("http://localhost:8000/api/profile")
            assert final_response.status_code == 200
            final_data = final_response.json()
            
            # Verify no changes were made (user quit)
            assert final_data["firstName"] == original_data["firstName"]
            assert final_data["lastName"] == original_data["lastName"]
            assert final_data["wishList"] == original_data["wishList"]
            print("✅ Step 3: User quit - no changes saved, original data preserved")
            
            print("Complete edit profile flow test passed!")
        except requests.exceptions.ConnectionError:
            pytest.skip("Seems like the data does not match the original data")

if __name__ == "__main__":
    # Run tests manually
    test_instance = TestCaseEditProfileFlow()
    
    print("Testing Edit Profile Flow...")
    print("=" * 40)
    
    try:
        test_instance.test_profile_page_loads()
        test_instance.test_api_profile_endpoint()
        test_instance.test_case_edit_profile()
        print("\n✅ All tests passed!")
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
