from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationTestCase(APITestCase):
    def setUp(self):
        self.user_data = {
            "username": "test-user",
            "email": "test@mail.com",
            "password": "123456",
        }

    def test_not_authenticated_protected_endpoint(self):
        """Try to access a protected endpoint without a token"""

        response = self.client.get(f"/api/users/{self.user_data['username']}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_protected_endpoint(self):
        """Try to access a protected endpoint with a valid token"""

        # Register a user
        register_response = self.client.post(
            "/auth/register", data=self.user_data, format="json"
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        data = register_response.json()
        self.assertIn("token", data)

        # Access protected route with credentials
        users_response = self.client.get(
            f"/api/users/{self.user_data['username']}",
            format="json",
            **{"HTTP_X-ACCESS-TOKEN": data.get("token")},
        )
        self.assertEqual(users_response.status_code, status.HTTP_200_OK)

        data = users_response.json()
        self.assertEqual(data, [])



class ReadMessagesTestCase(APITestCase):
    def setUp(self):
        self.user_data_one = {
            "username": "thomas",
            "email": "thomas@email.com",
            "password": "123456",
        }
        self.user_data_two = {
            "username": "santiago",
            "email": "santiago@email.com",
            "password": "123456",
        }
        self.message_data_one = {
            "recipientId": "3",
            "text": "Hello"
        }
        self.message_data_two = {
            "conversationId": "1",
            "recipientId": "2",
            "text": "Hello too!",
            "sender": ""
        }
        self.conversationId = {
            "conversationId": "1",
        }


    def test_authenticated_protected_endpoint(self):
        """Try to access a protected endpoint with a valid token"""

        # Register user one
        register_response_one = self.client.post(
            "/auth/register", data=self.user_data_one, format="json"
        )
        self.assertEqual(register_response_one.status_code, status.HTTP_201_CREATED)

        data_one = register_response_one.json()
        self.assertIn("token", data_one)

        # Register user two
        register_response_two = self.client.post(
            "/auth/register", data=self.user_data_two, format="json"
        )
        self.assertEqual(register_response_two.status_code, status.HTTP_201_CREATED)

        data_two = register_response_two.json()
        self.assertIn("token", data_two)

        # Send message one
        send_message_response_one = self.client.post(
             "/api/messages", data=self.message_data_one, format="json",**{"HTTP_X-ACCESS-TOKEN": data_one.get("token")}
        )
        self.assertEqual(send_message_response_one.status_code, 200)

        # pull latest conversations
        conversations_response = self.client.get(
              "/api/conversations",
              format="json",
              **{"HTTP_X-ACCESS-TOKEN": data_one.get("token")},
        )
        self.assertEqual(conversations_response.status_code, status.HTTP_200_OK)
        # Make sure that the last message is unread
        self.assertEqual(conversations_response.json()[0].get("messages")[0].get("hasBeenRead"), False)

        # Read message one by user two
        read_message_response_one = self.client.post(
             "/api/conversations/read", data=self.conversationId, format="json",**{"HTTP_X-ACCESS-TOKEN": data_two.get("token")}
        )
        self.assertEqual(read_message_response_one.status_code, 200)

        # pull latest conversations again
        conversations_response = self.client.get(
             "/api/conversations",
             format="json",
             **{"HTTP_X-ACCESS-TOKEN": data_one.get("token")},
        )
        self.assertEqual(conversations_response.status_code, status.HTTP_200_OK)

        # Make sure that the last message is read now
        self.assertEqual(conversations_response.json()[0].get("messages")[0].get("hasBeenRead"), True)

        # Send message two
        send_message_response_two = self.client.post(
            "/api/messages", data=self.message_data_two, format="json",**{"HTTP_X-ACCESS-TOKEN": data_two.get("token")}
        )
        self.assertEqual(send_message_response_two.status_code, 200)

        # Read message two by user one
        read_message_response_two = self.client.post(
            "/api/conversations/read", data=self.conversationId, format="json",**{"HTTP_X-ACCESS-TOKEN": data_one.get("token")}
         )
        self.assertEqual(read_message_response_two.status_code, 200)

        # Send multiple messages
        for x in range(6):
            send_message_response_multiple = self.client.post(
                        "/api/messages", data=self.message_data_two, format="json",**{"HTTP_X-ACCESS-TOKEN": data_two.get("token")}
            )
            self.assertEqual(send_message_response_multiple.status_code, 200)

        # Read message two by user one
        read_message_response_multiple = self.client.post(
             "/api/conversations/read", data=self.conversationId, format="json",**{"HTTP_X-ACCESS-TOKEN": data_one.get("token")}
        )
        self.assertEqual(read_message_response_multiple.status_code, 200)

        # pull latest conversations again
        conversations_response = self.client.get(
             "/api/conversations",
             format="json",
             **{"HTTP_X-ACCESS-TOKEN": data_one.get("token")},
        )
        self.assertEqual(conversations_response.status_code, status.HTTP_200_OK)

        # Make sure that the last message is read now
        self.assertEqual(conversations_response.json()[0].get("messages")[0].get("hasBeenRead"), True)

