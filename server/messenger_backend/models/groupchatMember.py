from django.db import models
from django.db.models import Q

from . import utils
from .user import User
from .groupchat import Groupchat

class GroupchatMember(utils.CustomModel):


     user = models.ForeignKey(
            User, on_delete=models.CASCADE, db_column="userId", related_name="+"
     )
     groupchat = models.ForeignKey(
                 Groupchat, on_delete=models.CASCADE, db_column="groupchatId", related_name="+"
     )
     createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
     isAdmin = models.BooleanField(default = False)

     # Possible field to implement in future:
     # accessLevel; - read messages, write messages etc.
     # banned (true / false);



