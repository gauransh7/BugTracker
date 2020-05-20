from rest_framework import serializers
from BugTracker.models import User,Bug,Comment,Project

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__' 

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class BugSerializer(serializers.ModelSerializer):     
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