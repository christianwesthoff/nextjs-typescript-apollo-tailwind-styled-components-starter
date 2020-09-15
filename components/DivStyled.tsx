import tw from '@tailwindcssinjs/macro'
import styled from '@emotion/styled'

const DivStyled: React.FC = ({ children }) => {
    const Div = styled.div`
        ${tw`font-mono text-sm text-gray-800`}
    `
    return <Div>{children}</Div>
}
export default DivStyled