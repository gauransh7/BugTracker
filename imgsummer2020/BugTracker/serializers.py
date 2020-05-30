from rest_framework import serializers
from BugTracker.models import User,Bug,Comment,Project
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 

class ProjectSerializer(serializers.ModelSerializer):
    createdbyname = serializers.ReadOnlyField()   
    # usernames = serializers.ReadOnlyField()  
    class Meta:
        model = Project
        fields = '__all__'

class BugSerializer(serializers.ModelSerializer): 
    createdbyname = serializers.ReadOnlyField()   
    assigntouser = serializers.ReadOnlyField()    
    def update(self, instance, validated_data):
        validated_data.pop('heading', None) 
        validated_data.pop('description', None) 
        validated_data.pop('user', None)  # prevent heading from being updated
        return super().update(instance, validated_data)

    class Meta:
        model = Bug
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class AuthSerializer(serializers.Serializer):
    client_id = serializers.CharField(required=True)
    client_secret = serializers.CharField(required=True)
    grant_type = serializers.CharField(required=True)
    redirect_url = serializers.CharField(required=True)
    code = serializers.CharField(required=True)

class AuthTokenSerializer(serializers.Serializer):
    enr_no = serializers.CharField(
        label=_("enr_no"),
        write_only=True
    )
    # password = serializers.CharField(
    #     label=_("Password"),
    #     style={'input_type': 'password'},
    #     trim_whitespace=False,
    #     write_only=True
    # )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        enr_no = attrs.get('enr_no')
        # password = attrs.get('password')

        if enr_no:
            user = authenticate(request=self.context.get('request'),
                                enr_no=enr_no)

            # The authenticate call simply returns None for is_active=False
            # users. (Assuming the default ModelBackend authentication
            # backend.)
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "username" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs