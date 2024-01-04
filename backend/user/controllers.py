from django.core.exceptions import ObjectDoesNotExist
from .models import User

def get_user(user_id):
    try:
        u = User.objects.get(id=user_id)
        return u, True
    except ObjectDoesNotExist:
        return "not found", False
    except Exception as e:
        print(e)
        return "errors", False