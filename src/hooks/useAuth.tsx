
import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabaseClient';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle auth events
        if (event === 'SIGNED_IN' && session) {
          // Create a profile entry for new users
          const createProfile = async () => {
            try {
              console.log("Checking for existing profile for user:", session.user.id);
              const { data, error } = await supabase
                .from('profiles')
                .select()
                .eq('id', session.user.id)
                .single();
              
              if (error && error.code === 'PGRST116') { // Record not found
                console.log("Profile not found, creating new profile for user:", session.user.id);
                const { data: insertData, error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: session.user.id
                  })
                  .select();
                
                if (insertError) {
                  console.error("Failed to create profile:", insertError);
                } else {
                  console.log("Profile created successfully:", insertData);
                }
              } else if (data) {
                console.log("Existing profile found:", data);
              }
            } catch (err) {
              console.error("Error checking/creating profile:", err);
            }
          };
          
          // Use setTimeout to avoid deadlock in the auth state listener
          setTimeout(() => {
            createProfile();
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
