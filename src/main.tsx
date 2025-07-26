import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelloWorld, ReferencedData } from './components'
import { UserPreview } from '../examples/basic/user-preview'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-4">
          <HelloWorld />
          <HelloWorld name="RSL Ref Peek" className="bg-green-100 text-green-900" />
        </div>
        
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">ReferencedData Test</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Hover over the links below to see user data:
            </p>
            
            <div className="space-y-2">
              <p>
                Created by{' '}
                <ReferencedData
                  dataId="user_123"
                  component={UserPreview}
                  linkUrl="/users/123"
                  onResolved={(data: unknown) => console.log('User resolved:', data)}
                  onError={(error: Error) => console.error('User error:', error)}
                  onLoading={() => console.log('Loading user...')}
                >
                  <input value={"test"} />
                </ReferencedData>
              </p>
              
              <p>
                Assigned to{' '}
                <ReferencedData
                  dataId="user_456"
                  component={UserPreview}
                  delay={500}
                >
                  Jane Smith
                </ReferencedData>
              </p>
              
              <p>
                Invalid user:{' '}
                <ReferencedData
                  dataId="user_999"
                  component={UserPreview}
                  className="text-destructive"
                >
                  Unknown User
                </ReferencedData>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </StrictMode>,
)