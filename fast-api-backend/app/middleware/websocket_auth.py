from fastapi import WebSocket
from ..auth import verify_token

class WebSocketAuthMiddleware:
    async def __call__(self, websocket: WebSocket, next_handler):
        try:
            # Get token from query parameter or header
            token = websocket.query_params.get('token') or websocket.headers.get('authorization')
            
            if not token:
                await websocket.close(code=4001, reason="No authentication token provided")
                return
            
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token.replace('Bearer ', '')
            
            # Verify token
            user = await verify_token(token)
            if not user:
                await websocket.close(code=4002, reason="Invalid authentication token")
                return

            # Add user to websocket state
            websocket.state.user = user
            
            await next_handler(websocket)
        except Exception as e:
            await websocket.close(code=4003, reason=str(e))
            return 