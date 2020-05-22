from rest_framework import permissions

# class IsOwnerOrReadOnly(permissions.BasePermission):
#     """
#     Object-level permission to only allow owners of an object to edit it.
#     Assumes the model instance has an `owner` attribute.
#     """

#     def has_object_permission(self, request, view, obj):
#         # Read permissions are allowed to any request,
#         # so we'll always allow GET, HEAD or OPTIONS requests.
#         if request.method in permissions.SAFE_METHODS:
#             return True

#         if request.user.is_staff == 1:
#             return True

#         # Instance must have an attribute named `owner`.
#         return obj.user == request.user

class HasProjectPermissions(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    # def is_admin(self,request):
    #     if request.user.is_staff:
    #         return True

    
    def has_object_permission(self, request, view, obj):
        users = obj.user.all()
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff == True:
            return True
        
        if request.user == obj.creator:
            return True
        # Instance must have an attribute named `owner`.

        return request.user in users


class HasBugPermissions(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    # def is_admin(self,request):
    #     if request.user.is_staff:
    #         return True

    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff == True:
            return True

        if request.user == obj.project.creator or request.user in obj.project.user.all():
            return True

        # Instance must have an attribute named `owner`.
        return obj.user == request.user or obj.assign_to == request.user


class HasCommentPermissions(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """
    # def is_admin(self,request):
    #     if request.user.is_staff:
    #         return True

    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        if request.user.is_staff == True:
            return True

        if request.user == obj.bug.project.creator or request.user in obj.bug.project.user.all() or obj.bug.assign_to==request.user:
            return True

        # Instance must have an attribute named `owner`.
        return obj.user == request.user 

# class HasProjectPermissions(permissions.BasePermission):
#     """
#     Object-level permission to only allow owners of an object to edit it.
#     Assumes the model instance has an `owner` attribute.
#     """
#     # def is_admin(self,request):
#     #     if request.user.is_staff:
#     #         return True

    
#     def has_object_permission(self, request, view, obj):
#         # Read permissions are allowed to any request,
#         # so we'll always allow GET, HEAD or OPTIONS requests.
#         if request.method in permissions.SAFE_METHODS:
#             return True

#         if request.user.is_staff == True:
#             return True

#         # Instance must have an attribute named `owner`.
#         return obj.user == request.user
