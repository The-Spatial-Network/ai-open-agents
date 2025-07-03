# AI Open Agents - Utility Modules
# This package contains utility modules for interacting with external services.

from .supabase import SupabaseClient

# Import other utility clients as they become available
# from .nextcloud import NextCloudClient
# from .wordpress import WordPressClient

__all__ = ['SupabaseClient']
# Add other utility clients to __all__ as they become available
# __all__ = ['SupabaseClient', 'NextCloudClient', 'WordPressClient']
